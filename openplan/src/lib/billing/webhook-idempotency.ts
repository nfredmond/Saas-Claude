import { createServiceRoleClient } from "@/lib/supabase/server";

export type WebhookProvider = "legacy" | "stripe";

type ClaimWebhookEventInput = {
  provider: WebhookProvider;
  eventId: string;
  eventType: string;
  payloadHash: string;
  workspaceId?: string;
};

type CompleteWebhookEventInput = {
  receiptId: string;
  status: "processed" | "ignored" | "failed";
  workspaceId?: string;
  eventType?: string;
  failureReason?: string;
};

export async function claimWebhookEvent({
  provider,
  eventId,
  eventType,
  payloadHash,
  workspaceId,
}: ClaimWebhookEventInput): Promise<{ accepted: boolean; receiptId?: string }> {
  const supabase = createServiceRoleClient();

  const { data, error } = await supabase
    .from("billing_webhook_receipts")
    .insert({
      provider,
      event_id: eventId,
      event_type: eventType,
      payload_hash: payloadHash,
      workspace_id: workspaceId,
      status: "received",
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      const { data: existing } = await supabase
        .from("billing_webhook_receipts")
        .select("id")
        .eq("provider", provider)
        .eq("event_id", eventId)
        .maybeSingle();

      return { accepted: false, receiptId: existing?.id };
    }

    throw new Error(error.message);
  }

  return { accepted: true, receiptId: data.id };
}

export async function completeWebhookEvent({
  receiptId,
  status,
  workspaceId,
  eventType,
  failureReason,
}: CompleteWebhookEventInput): Promise<void> {
  const supabase = createServiceRoleClient();

  const updates: Record<string, unknown> = {
    status,
    event_type: eventType,
    workspace_id: workspaceId,
    failure_reason: failureReason ?? null,
    processed_at: status === "processed" || status === "ignored" ? new Date().toISOString() : null,
  };

  const { error } = await supabase.from("billing_webhook_receipts").update(updates).eq("id", receiptId);

  if (error) {
    throw new Error(error.message);
  }
}
