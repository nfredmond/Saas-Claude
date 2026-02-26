export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const STATUS_SEMANTICS: Record<string, StatusTone> = {
  // lifecycle
  loading: "info",
  loaded: "success",
  signedout: "warning",
  "signed-out": "warning",
  nomembership: "warning",
  "no-membership": "warning",
  error: "danger",

  // data quality / availability
  live: "success",
  available: "success",
  unavailable: "warning",
  estimated: "info",
  unknown: "neutral",

  // priority / confidence
  high: "success",
  medium: "warning",
  low: "danger",

  // run states
  current: "info",
  comparing: "info",
  baseline: "neutral",
  loadedrun: "success",
};

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "").replace(/_/g, "-");
}

export function resolveStatusTone(status: string, fallback: StatusTone = "neutral"): StatusTone {
  const normalized = normalizeKey(status);

  if (STATUS_SEMANTICS[normalized]) {
    return STATUS_SEMANTICS[normalized];
  }

  // try aliasing with punctuation stripped
  const compressed = normalized.replace(/-/g, "");
  if (STATUS_SEMANTICS[compressed]) {
    return STATUS_SEMANTICS[compressed];
  }

  return fallback;
}

export function toneFromBoolean(
  value: boolean | null | undefined,
  trueTone: StatusTone = "success",
  falseTone: StatusTone = "danger"
): StatusTone {
  return value ? trueTone : falseTone;
}

export function toneFromDelta(delta: number): StatusTone {
  if (delta > 0) {
    return "success";
  }

  if (delta < 0) {
    return "danger";
  }

  return "neutral";
}
