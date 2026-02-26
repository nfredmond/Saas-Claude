export type WorkspacePlan = "pilot" | "starter" | "professional" | "enterprise" | "unknown";

export function normalizeWorkspacePlan(value: string | null | undefined): WorkspacePlan {
  const normalized = (value ?? "").toLowerCase().trim();

  if (normalized === "pilot") return "pilot";
  if (normalized === "starter") return "starter";
  if (normalized === "professional" || normalized === "pro") return "professional";
  if (normalized === "enterprise") return "enterprise";
  return "unknown";
}

export function monthlyRunLimitForPlan(plan: WorkspacePlan): number | null {
  switch (plan) {
    case "pilot":
      return 150;
    case "starter":
      return 100;
    case "professional":
      return 500;
    case "enterprise":
      return null;
    case "unknown":
    default:
      return 100;
  }
}

export function runLimitMessage(plan: WorkspacePlan, usedRuns: number, limit: number): string {
  const planLabel = plan === "unknown" ? "current" : plan;
  return `Monthly run limit reached for ${planLabel} plan (${usedRuns}/${limit}). Upgrade plan or wait until next billing cycle.`;
}
