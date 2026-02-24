/**
 * CEJST-aligned equity screening.
 *
 * This module uses tract-level ACS inputs we already fetch and applies
 * transparent proxy thresholds aligned with CEJST/Justice40 concepts:
 * low income + burden indicators (poverty, minority concentration,
 * low vehicle access, and transit dependency).
 */

export interface EquityScreening {
  totalTracts: number;
  disadvantagedTracts: number;
  pctDisadvantaged: number;
  lowIncomeTracts: number;
  highPovertyTracts: number;
  highMinorityTracts: number;
  lowVehicleAccessTracts: number;
  highTransitDependencyTracts: number;
  burdenedLowIncomeTracts: number;
  ejIndicators: {
    lowIncome: boolean;
    highMinority: boolean;
    linguisticallyIsolated: boolean;
    highPoverty: boolean;
    lowVehicleAccess: boolean;
    transitDependent: boolean;
  };
  title6Flags: string[];
  justice40Eligible: boolean;
  equityScore: number;
  source: "cejst-proxy-census";
}

interface CensusTractForEquity {
  geoid: string;
  pctMinority: number;
  pctBelowPoverty: number;
  medianIncome: number | null;
  zeroVehicleHouseholds: number;
  totalHouseholds: number;
  transitCommuters?: number;
  totalCommuters?: number;
}

const THRESHOLDS = {
  lowIncomeMedian: 50000,
  highPovertyPct: 30,
  highMinorityPct: 50,
  lowVehicleAccessPct: 10,
  transitDependencyPct: 15,
};

function pct(numerator: number, denominator: number): number {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 1000) / 10;
}

export function screenEquity(
  censusData: {
    pctMinority: number;
    pctBelowPoverty: number;
    pctZeroVehicle: number;
    pctTransit: number;
    medianIncomeWeighted: number | null;
    tracts: CensusTractForEquity[];
  }
): EquityScreening {
  const tracts = censusData.tracts;

  const tractFlags = tracts.map((tract) => {
    const zeroVehiclePct = pct(tract.zeroVehicleHouseholds, tract.totalHouseholds);
    const transitPct = pct(tract.transitCommuters ?? 0, tract.totalCommuters ?? 0);

    const lowIncome = tract.medianIncome !== null && tract.medianIncome < THRESHOLDS.lowIncomeMedian;
    const highPoverty = tract.pctBelowPoverty >= THRESHOLDS.highPovertyPct;
    const highMinority = tract.pctMinority >= THRESHOLDS.highMinorityPct;
    const lowVehicleAccess = zeroVehiclePct >= THRESHOLDS.lowVehicleAccessPct;
    const transitDependency = transitPct >= THRESHOLDS.transitDependencyPct;

    const burdenCount = [highPoverty, highMinority, lowVehicleAccess, transitDependency].filter(Boolean).length;
    const disadvantaged = lowIncome && burdenCount >= 1;

    return {
      geoid: tract.geoid,
      lowIncome,
      highPoverty,
      highMinority,
      lowVehicleAccess,
      transitDependency,
      disadvantaged,
    };
  });

  const disadvantagedTracts = tractFlags.filter((t) => t.disadvantaged).length;
  const lowIncomeTracts = tractFlags.filter((t) => t.lowIncome).length;
  const highPovertyTracts = tractFlags.filter((t) => t.highPoverty).length;
  const highMinorityTracts = tractFlags.filter((t) => t.highMinority).length;
  const lowVehicleAccessTracts = tractFlags.filter((t) => t.lowVehicleAccess).length;
  const highTransitDependencyTracts = tractFlags.filter((t) => t.transitDependency).length;
  const burdenedLowIncomeTracts = tractFlags.filter(
    (t) =>
      t.lowIncome &&
      (t.highPoverty || t.highMinority || t.lowVehicleAccess || t.transitDependency)
  ).length;

  const pctDisadvantaged = pct(disadvantagedTracts, tracts.length);

  const ejIndicators = {
    lowIncome:
      censusData.medianIncomeWeighted !== null &&
      censusData.medianIncomeWeighted < THRESHOLDS.lowIncomeMedian,
    highMinority: censusData.pctMinority >= 40,
    linguisticallyIsolated: false,
    highPoverty: censusData.pctBelowPoverty >= 20,
    lowVehicleAccess: censusData.pctZeroVehicle >= 10,
    transitDependent: censusData.pctTransit >= 12,
  };

  const title6Flags: string[] = [];
  if (ejIndicators.highMinority) {
    title6Flags.push("Corridor serves a high proportion of minority residents");
  }
  if (ejIndicators.lowIncome) {
    title6Flags.push("Corridor median household income is below CEJST-proxy low-income threshold");
  }
  if (ejIndicators.highPoverty) {
    title6Flags.push("Corridor poverty rate indicates concentrated economic burden");
  }
  if (ejIndicators.lowVehicleAccess) {
    title6Flags.push("A significant share of households lacks vehicle access");
  }
  if (ejIndicators.transitDependent) {
    title6Flags.push("Transit-dependent households indicate strong multimodal investment need");
  }

  const justice40Eligible = disadvantagedTracts > 0;

  const equityScore = Math.min(
    100,
    Math.round(
      pctDisadvantaged * 0.4 +
        pct(highPovertyTracts, tracts.length) * 0.2 +
        pct(lowVehicleAccessTracts, tracts.length) * 0.2 +
        pct(highTransitDependencyTracts, tracts.length) * 0.2
    )
  );

  return {
    totalTracts: tracts.length,
    disadvantagedTracts,
    pctDisadvantaged,
    lowIncomeTracts,
    highPovertyTracts,
    highMinorityTracts,
    lowVehicleAccessTracts,
    highTransitDependencyTracts,
    burdenedLowIncomeTracts,
    ejIndicators,
    title6Flags,
    justice40Eligible,
    equityScore,
    source: "cejst-proxy-census",
  };
}
