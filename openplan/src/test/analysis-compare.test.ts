import { describe, expect, it } from "vitest";
import { buildMetricDeltas, deltaTone, formatDelta } from "@/lib/analysis/compare";

describe("analysis comparison utilities", () => {
  it("computes numeric deltas for known metrics", () => {
    const deltas = buildMetricDeltas(
      { overallScore: 72, accessibilityScore: 80, safetyScore: 60 },
      { overallScore: 64, accessibilityScore: 75, safetyScore: 65 }
    );

    const overall = deltas.find((d) => d.key === "overallScore");
    const safety = deltas.find((d) => d.key === "safetyScore");

    expect(overall?.delta).toBe(8);
    expect(overall?.deltaPct).toBe(12.5);
    expect(safety?.delta).toBe(-5);
  });

  it("handles missing values gracefully", () => {
    const deltas = buildMetricDeltas({ accessibilityScore: 70 }, { accessibilityScore: "n/a" });
    const accessibility = deltas.find((d) => d.key === "accessibilityScore");

    expect(accessibility?.delta).toBeNull();
    expect(accessibility?.deltaPct).toBeNull();
    expect(formatDelta(accessibility?.delta ?? null)).toBe("N/A");
  });

  it("returns expected tone labels", () => {
    expect(deltaTone(3)).toBe("up");
    expect(deltaTone(-1)).toBe("down");
    expect(deltaTone(0)).toBe("flat");
    expect(deltaTone(null)).toBe("na");
  });
});
