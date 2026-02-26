import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { logBillingEvent } from "@/lib/billing/events";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { createApiAuditLogger } from "@/lib/observability/audit";

const webhookSchema = z.object({
  workspaceId: z.string().uuid(),
  subscriptionStatus: z.enum([
    "active",
    "trialing",
    "past_due",
    "canceled",
    "incomplete",
    "unpaid",
    "checkout_pending",
    "pilot",
    "inactive",
  ]),
  subscriptionPlan: z.enum(["starter", "professional", "enterprise", "pilot"]).optional(),
  stripeCustomerId: z.string().optional(),
  stripeSubscriptionId: z.string().optional(),
  currentPeriodEnd: z.string().datetime().optional(),
  source: z.string().optional(),
});

function isAuthorized(request: NextRequest): boolean {
  const expectedSecret = process.env.OPENPLAN_BILLING_WEBHOOK_SECRET?.trim();
  if (!expectedSecret) {
    return false;
  }

  const headerSecret = request.headers.get("x-openplan-billing-secret")?.trim();
  return Boolean(headerSecret && headerSecret === expectedSecret);
}

export async function POST(request: NextRequest) {
  const audit = createApiAuditLogger("billing.webhook", request);
  const startedAt = Date.now();

  if (!isAuthorized(request)) {
    audit.warn("unauthorized", {
      hasConfiguredSecret: Boolean(process.env.OPENPLAN_BILLING_WEBHOOK_SECRET),
    });

    return NextResponse.json({ error: "Unauthorized webhook request" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = webhookSchema.safeParse(body);

  if (!parsed.success) {
    audit.warn("validation_failed", {
      issues: parsed.error.issues.length,
    });

    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }

  const payload = parsed.data;

  const serviceSupabase = createServiceRoleClient();
  const { error } = await serviceSupabase
    .from("workspaces")
    .update({
      plan: payload.subscriptionPlan,
      subscription_plan: payload.subscriptionPlan,
      subscription_status: payload.subscriptionStatus,
      stripe_customer_id: payload.stripeCustomerId,
      stripe_subscription_id: payload.stripeSubscriptionId,
      subscription_current_period_end: payload.currentPeriodEnd,
      billing_updated_at: new Date().toISOString(),
    })
    .eq("id", payload.workspaceId);

  if (error) {
    audit.error("workspace_update_failed", {
      workspaceId: payload.workspaceId,
      message: error.message,
      code: error.code ?? null,
      source: payload.source ?? "unknown",
    });

    return NextResponse.json({ error: "Failed to apply billing update" }, { status: 500 });
  }

  try {
    await logBillingEvent({
      workspaceId: payload.workspaceId,
      eventType: "webhook_billing_updated",
      source: payload.source ?? "webhook",
      payload: {
        subscriptionStatus: payload.subscriptionStatus,
        subscriptionPlan: payload.subscriptionPlan ?? null,
        stripeCustomerId: payload.stripeCustomerId ?? null,
        stripeSubscriptionId: payload.stripeSubscriptionId ?? null,
        currentPeriodEnd: payload.currentPeriodEnd ?? null,
      },
    });
  } catch (eventError) {
    audit.warn("billing_event_log_failed", {
      workspaceId: payload.workspaceId,
      message: eventError instanceof Error ? eventError.message : "unknown",
    });
  }

  audit.info("workspace_billing_updated", {
    workspaceId: payload.workspaceId,
    subscriptionStatus: payload.subscriptionStatus,
    subscriptionPlan: payload.subscriptionPlan ?? null,
    source: payload.source ?? "unknown",
    durationMs: Date.now() - startedAt,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}
