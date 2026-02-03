import type { Gravidity, AMHPercentileData } from './types';

// Spontaneous Fecundability (Steiner 2016)
// Format: { ageMin: { nulligravid: rate, prior_pregnancy: rate } }
const FECUNDABILITY_DATA: Record<number, { nulligravid: number; prior_pregnancy: number }> = {
  30: { nulligravid: 0.173, prior_pregnancy: 0.234 },
  32: { nulligravid: 0.188, prior_pregnancy: 0.232 },
  34: { nulligravid: 0.113, prior_pregnancy: 0.222 },
  36: { nulligravid: 0.120, prior_pregnancy: 0.160 },
  38: { nulligravid: 0.052, prior_pregnancy: 0.171 },
  40: { nulligravid: 0.029, prior_pregnancy: 0.098 },
  42: { nulligravid: 0.032, prior_pregnancy: 0.089 },
};

export function lookupFecundability(age: number, gravidity: Gravidity): number {
  const ages = Object.keys(FECUNDABILITY_DATA).map(Number).sort((a, b) => a - b);

  // Find the appropriate age band
  let ageKey = ages[0];
  for (const a of ages) {
    if (age >= a) ageKey = a;
  }

  return FECUNDABILITY_DATA[ageKey][gravidity];
}

// Miscarriage Rates (Magnus 2019)
// Using nulligravid -> nulliparous, prior_pregnancy -> parous
const MISCARRIAGE_DATA: Record<number, { nulligravid: number; prior_pregnancy: number }> = {
  20: { nulligravid: 0.10, prior_pregnancy: 0.05 },
  25: { nulligravid: 0.10, prior_pregnancy: 0.05 },
  30: { nulligravid: 0.12, prior_pregnancy: 0.06 },
  35: { nulligravid: 0.18, prior_pregnancy: 0.09 },
  40: { nulligravid: 0.34, prior_pregnancy: 0.17 },
  45: { nulligravid: 0.53, prior_pregnancy: 0.53 },
};

export function lookupMiscarriage(age: number, gravidity: Gravidity): number {
  const ages = Object.keys(MISCARRIAGE_DATA).map(Number).sort((a, b) => a - b);

  let ageKey = ages[0];
  for (const a of ages) {
    if (age >= a) ageKey = a;
  }

  return MISCARRIAGE_DATA[ageKey][gravidity];
}

// Aneuploidy Risk at Delivery (ACOG 2020)
// Values are percentages converted to decimals
const ANEUPLOIDY_DATA: Record<number, number> = {
  20: 0.00819672,
  25: 0.00840336,
  30: 0.00909091,
  35: 0.01190476,
  40: 0.025,
  41: 0.025,
  42: 0.025,
  43: 0.025,
  44: 0.025,
  45: 0.025,
};

export function lookupAneuploidy(age: number): number {
  const ages = Object.keys(ANEUPLOIDY_DATA).map(Number).sort((a, b) => a - b);

  // Clamp to available range
  if (age < ages[0]) return ANEUPLOIDY_DATA[ages[0]];
  if (age > ages[ages.length - 1]) return ANEUPLOIDY_DATA[ages[ages.length - 1]];

  // Find exact match or closest lower
  let ageKey = ages[0];
  for (const a of ages) {
    if (age >= a) ageKey = a;
  }

  return ANEUPLOIDY_DATA[ageKey];
}

// Blastulation Rates (Romanski 2022)
const BLASTULATION_DATA: Record<number, number> = {
  30: 0.667, // ≤30
  31: 0.700,
  32: 0.707,
  33: 0.667,
  34: 0.667,
  35: 0.703,
  36: 0.667,
  37: 0.667,
  38: 0.667,
  39: 0.667,
  40: 0.667,
  41: 0.600,
  42: 0.547,
  43: 0.571,
  44: 0.429, // ≥44
};

export function lookupBlastulation(age: number): number {
  if (age <= 30) return BLASTULATION_DATA[30];
  if (age >= 44) return BLASTULATION_DATA[44];
  return BLASTULATION_DATA[age] ?? BLASTULATION_DATA[30];
}

// Euploidy Rates (Franasiak 2014)
const EUPLOIDY_DATA: Record<number, number> = {
  22: 0.556,
  23: 0.592,
  24: 0.722,
  25: 0.556,
  26: 0.754,
  27: 0.729,
  28: 0.773,
  29: 0.793,
  30: 0.768,
  31: 0.690,
  32: 0.689,
  33: 0.690,
  34: 0.687,
  35: 0.655,
  36: 0.645,
  37: 0.574,
  38: 0.521,
  39: 0.471,
  40: 0.418,
  41: 0.311,
  42: 0.249,
  43: 0.166,
  44: 0.118,
  45: 0.157,
};

export function lookupEuploidy(age: number): number {
  if (age < 22) return EUPLOIDY_DATA[22];
  if (age > 45) return EUPLOIDY_DATA[45];
  return EUPLOIDY_DATA[age] ?? EUPLOIDY_DATA[35];
}

// Live Birth Rate per Euploid Transfer (Yan 2021, Linder 2025)
const LIVE_BIRTH_PER_EUPLOID_DATA: { ageMin: number; ageMax: number; rate: number }[] = [
  { ageMin: 0, ageMax: 30, rate: 0.668 },
  { ageMin: 31, ageMax: 35, rate: 0.617 },
  { ageMin: 36, ageMax: 37, rate: 0.558 },
  { ageMin: 38, ageMax: 40, rate: 0.525 },
  { ageMin: 41, ageMax: 42, rate: 0.489 },
  { ageMin: 43, ageMax: 44, rate: 0.478 },
  { ageMin: 45, ageMax: 99, rate: 0.434 },
];

export function lookupLiveBirthPerEuploid(age: number): number {
  for (const band of LIVE_BIRTH_PER_EUPLOID_DATA) {
    if (age >= band.ageMin && age <= band.ageMax) {
      return band.rate;
    }
  }
  return LIVE_BIRTH_PER_EUPLOID_DATA[LIVE_BIRTH_PER_EUPLOID_DATA.length - 1].rate;
}

// AMH Reference Data (Aslan 2025)
const AMH_REFERENCE_DATA: Record<number, AMHPercentileData> = {
  18: { median: 3.8, p25: 1.9, p75: 7.0, percentileDOR: 15.9 },
  19: { median: 4.0, p25: 2.3, p75: 6.8, percentileDOR: 11.7 },
  20: { median: 4.2, p25: 2.5, p75: 6.7, percentileDOR: 8.5 },
  21: { median: 4.2, p25: 2.6, p75: 6.8, percentileDOR: 8.2 },
  22: { median: 4.1, p25: 2.2, p75: 6.4, percentileDOR: 10.5 },
  23: { median: 3.9, p25: 2.1, p75: 6.3, percentileDOR: 11.2 },
  24: { median: 3.6, p25: 2.0, p75: 6.1, percentileDOR: 12.2 },
  25: { median: 3.3, p25: 1.9, p75: 5.7, percentileDOR: 13.5 },
  26: { median: 3.4, p25: 1.9, p75: 6.0, percentileDOR: 14.6 },
  27: { median: 3.1, p25: 1.7, p75: 5.3, percentileDOR: 16.2 },
  28: { median: 2.8, p25: 1.5, p75: 4.9, percentileDOR: 18.6 },
  29: { median: 2.6, p25: 1.3, p75: 4.6, percentileDOR: 23.2 },
  30: { median: 2.5, p25: 1.2, p75: 4.3, percentileDOR: 24.3 },
  31: { median: 2.3, p25: 1.1, p75: 3.9, percentileDOR: 27.3 },
  32: { median: 2.0, p25: 0.9, p75: 3.8, percentileDOR: 33.2 },
  33: { median: 1.8, p25: 0.8, p75: 3.3, percentileDOR: 36.7 },
  34: { median: 1.7, p25: 0.7, p75: 3.3, percentileDOR: 39.3 },
  35: { median: 1.4, p25: 0.5, p75: 2.9, percentileDOR: 45.7 },
  36: { median: 1.1, p25: 0.4, p75: 2.3, percentileDOR: 52.9 },
  37: { median: 1.0, p25: 0.3, p75: 2.3, percentileDOR: 55.8 },
  38: { median: 0.7, p25: 0.2, p75: 1.7, percentileDOR: 64.0 },
  39: { median: 0.7, p25: 0.2, p75: 1.6, percentileDOR: 66.0 },
  40: { median: 0.5, p25: 0.2, p75: 1.3, percentileDOR: 73.0 },
  41: { median: 0.4, p25: 0.1, p75: 0.9, percentileDOR: 82.0 },
  42: { median: 0.3, p25: 0.1, p75: 0.8, percentileDOR: 85.0 },
  43: { median: 0.2, p25: 0.1, p75: 0.6, percentileDOR: 89.0 },
};

export function lookupAMHPercentile(age: number): AMHPercentileData | null {
  // Clamp age to available range
  const clampedAge = Math.max(18, Math.min(43, Math.round(age)));
  return AMH_REFERENCE_DATA[clampedAge] ?? null;
}

// Calculate approximate percentile for a given AMH value at a given age
export function calculateAMHPercentile(amh: number, age: number): string {
  const data = lookupAMHPercentile(age);
  if (!data) return 'N/A';

  if (amh < data.p25) {
    return '<25th';
  } else if (amh <= data.median) {
    return '25th-50th';
  } else if (amh <= data.p75) {
    return '50th-75th';
  } else {
    return '>75th';
  }
}

// Oocyte prediction model constants (La Marca 2012)
export const OOCYTE_MODEL = {
  intercept: 3.21,
  ageCoefficient: 0.036,
  amhCoefficient: 0.089,
};

// Fixed rates
export const MATURATION_RATE = 0.82; // MII rate
export const FERTILIZATION_RATE = 0.72; // 2PN rate
