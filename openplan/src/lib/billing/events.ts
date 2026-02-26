import { createServiceRoleClient } from "@/lib/supabase/server";

type BillingEventInput = {
  workspaceId: string;
  eventType: string;
  source?: string;
  payload?: Record<string, unknown>;
};

export async function logBillingEvent({ workspaceId, eventType, source = "system", payload = {} }: BillingEventInput) {
  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("billing_events").insert({
    workspace_id: workspaceId,
    event_type: eventType,
    source,
    payload,
  });

  if (error) {
    throw new Error(error.message);
  }
}
