import type { Gravidity, AMHPercentileData, OocyteRetrievalData } from './types';

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

// Trisomy 21 Risk at 1st Trimester (10 weeks) - Snijders et al. 1999
// Values represent "1 in X" risk (e.g., 983 means 1 in 983)
const TRISOMY21_FIRST_TRIMESTER_DATA: Record<number, number> = {
  20: 983,
  25: 870,
  30: 576,
  31: 500,
  32: 424,
  33: 352,
  34: 287,
  35: 229,
  36: 180,
  37: 140,
  38: 108,
  39: 82,
  40: 62,
  41: 47,
  42: 35,
  43: 26,
  44: 20,
  45: 15,
};

export function lookupTrisomy21FirstTrimester(age: number): number {
  const ages = Object.keys(TRISOMY21_FIRST_TRIMESTER_DATA).map(Number).sort((a, b) => a - b);

  // Clamp to available range
  if (age < ages[0]) return TRISOMY21_FIRST_TRIMESTER_DATA[ages[0]];
  if (age > ages[ages.length - 1]) return TRISOMY21_FIRST_TRIMESTER_DATA[ages[ages.length - 1]];

  // Find exact match or closest
  let ageKey = ages[0];
  let minDiff = Math.abs(age - ages[0]);
  for (const a of ages) {
    const diff = Math.abs(age - a);
    if (diff < minDiff) {
      minDiff = diff;
      ageKey = a;
    }
  }

  return TRISOMY21_FIRST_TRIMESTER_DATA[ageKey];
}

// Trisomy 21 Risk at 2nd Trimester - Snijders et al. 1999
// Values represent "1 in X" risk
const TRISOMY21_SECOND_TRIMESTER_DATA: Record<number, number> = {
  20: 1295,
  25: 1147,
  30: 759,
  31: 658,
  32: 559,
  33: 464,
  34: 378,
  35: 302,
  36: 238,
  37: 185,
  38: 142,
  39: 108,
  40: 82,
  41: 62,
  42: 46,
  43: 35,
  44: 26,
  45: 19,
};

export function lookupTrisomy21SecondTrimester(age: number): number {
  const ages = Object.keys(TRISOMY21_SECOND_TRIMESTER_DATA).map(Number).sort((a, b) => a - b);

  // Clamp to available range
  if (age < ages[0]) return TRISOMY21_SECOND_TRIMESTER_DATA[ages[0]];
  if (age > ages[ages.length - 1]) return TRISOMY21_SECOND_TRIMESTER_DATA[ages[ages.length - 1]];

  // Find exact match or closest
  let ageKey = ages[0];
  let minDiff = Math.abs(age - ages[0]);
  for (const a of ages) {
    const diff = Math.abs(age - a);
    if (diff < minDiff) {
      minDiff = diff;
      ageKey = a;
    }
  }

  return TRISOMY21_SECOND_TRIMESTER_DATA[ageKey];
}

// Trisomy 21 Risk at Delivery - Snijders et al. 1999
// Values represent "1 in X" risk
const TRISOMY21_DELIVERY_DATA: Record<number, number> = {
  20: 1527,
  25: 1352,
  30: 895,
  31: 776,
  32: 659,
  33: 547,
  34: 446,
  35: 356,
  36: 280,
  37: 218,
  38: 167,
  39: 128,
  40: 97,
  41: 73,
  42: 55,
  43: 41,
  44: 30,
  45: 23,
};

export function lookupTrisomy21Delivery(age: number): number {
  const ages = Object.keys(TRISOMY21_DELIVERY_DATA).map(Number).sort((a, b) => a - b);

  // Clamp to available range
  if (age < ages[0]) return TRISOMY21_DELIVERY_DATA[ages[0]];
  if (age > ages[ages.length - 1]) return TRISOMY21_DELIVERY_DATA[ages[ages.length - 1]];

  // Find exact match or closest
  let ageKey = ages[0];
  let minDiff = Math.abs(age - ages[0]);
  for (const a of ages) {
    const diff = Math.abs(age - a);
    if (diff < minDiff) {
      minDiff = diff;
      ageKey = a;
    }
  }

  return TRISOMY21_DELIVERY_DATA[ageKey];
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

// Cycle Cancellation Risk (Risk of not making it to retrieval)
// Data represents the probability of cycle cancellation before oocyte retrieval
// Format: { amhRange: { ageBand: risk } }
const CYCLE_CANCELLATION_DATA: {
  amhMin: number;
  amhMax: number | null;
  risks: { ageMin: number; ageMax: number | null; risk: number }[];
}[] = [
  {
    amhMin: 2.01,
    amhMax: null,
    risks: [
      { ageMin: 0, ageMax: 34, risk: 0.038 },
      { ageMin: 35, ageMax: 37, risk: 0.045 },
      { ageMin: 38, ageMax: 40, risk: 0.042 },
      { ageMin: 41, ageMax: 42, risk: 0.050 },
      { ageMin: 43, ageMax: null, risk: 0.080 },
    ],
  },
  {
    amhMin: 1.01,
    amhMax: 2.0,
    risks: [
      { ageMin: 0, ageMax: 34, risk: 0.070 },
      { ageMin: 35, ageMax: 37, risk: 0.014 },
      { ageMin: 38, ageMax: 40, risk: 0.049 },
      { ageMin: 41, ageMax: 42, risk: 0.067 },
      { ageMin: 43, ageMax: null, risk: 0.091 },
    ],
  },
  {
    amhMin: 0.71,
    amhMax: 1.0,
    risks: [
      { ageMin: 0, ageMax: 34, risk: 0.053 },
      { ageMin: 35, ageMax: 37, risk: 0.023 },
      { ageMin: 38, ageMax: 40, risk: 0.026 },
      { ageMin: 41, ageMax: 42, risk: 0.089 },
      { ageMin: 43, ageMax: null, risk: 0.081 },
    ],
  },
  {
    amhMin: 0.31,
    amhMax: 0.7,
    risks: [
      { ageMin: 0, ageMax: 34, risk: 0.099 },
      { ageMin: 35, ageMax: 37, risk: 0.115 },
      { ageMin: 38, ageMax: 40, risk: 0.127 },
      { ageMin: 41, ageMax: 42, risk: 0.211 },
      { ageMin: 43, ageMax: null, risk: 0.221 },
    ],
  },
  {
    amhMin: 0.17,
    amhMax: 0.3,
    risks: [
      { ageMin: 0, ageMax: 34, risk: 0.111 },
      { ageMin: 35, ageMax: 37, risk: 0.275 },
      { ageMin: 38, ageMax: 40, risk: 0.311 },
      { ageMin: 41, ageMax: 42, risk: 0.322 },
      { ageMin: 43, ageMax: null, risk: 0.400 },
    ],
  },
  {
    amhMin: 0,
    amhMax: 0.16,
    risks: [
      { ageMin: 0, ageMax: 34, risk: 0.286 },
      { ageMin: 35, ageMax: 37, risk: 0.458 },
      { ageMin: 38, ageMax: 40, risk: 0.325 },
      { ageMin: 41, ageMax: 42, risk: 0.429 },
      { ageMin: 43, ageMax: null, risk: 0.357 },
    ],
  },
];

export function lookupCycleCancellationRisk(age: number, amh: number): number {
  // Find the appropriate AMH band
  const amhBand = CYCLE_CANCELLATION_DATA.find(
    (band) => amh >= band.amhMin && (band.amhMax === null || amh <= band.amhMax)
  );

  if (!amhBand) {
    // Default to highest risk if AMH is out of range
    return CYCLE_CANCELLATION_DATA[CYCLE_CANCELLATION_DATA.length - 1].risks[
      CYCLE_CANCELLATION_DATA[CYCLE_CANCELLATION_DATA.length - 1].risks.length - 1
    ].risk;
  }

  // Find the appropriate age band within the AMH band
  const ageBand = amhBand.risks.find(
    (r) => age >= r.ageMin && (r.ageMax === null || age <= r.ageMax)
  );

  if (!ageBand) {
    // Default to highest age band if age is out of range
    return amhBand.risks[amhBand.risks.length - 1].risk;
  }

  return ageBand.risk;
}

// Oocyte Retrieval Data (Reichman et al. - AMH & age effect on egg yield)
// Data from: "Value of antimüllerian hormone as a prognostic indicator of in vitro fertilization outcome"
// Format: AMH range + Age band -> { mean, lowerQuartile, upperQuartile }
const OOCYTE_RETRIEVAL_DATA: {
  amhMin: number;
  amhMax: number | null;
  ageBands: {
    ageMin: number;
    ageMax: number | null;
    mean: number;
    lowerQuartile: number;
    upperQuartile: number;
  }[];
}[] = [
  {
    amhMin: 0,
    amhMax: 0.17,
    ageBands: [
      { ageMin: 0, ageMax: 35, mean: 4.8, lowerQuartile: 3, upperQuartile: 6 },
      { ageMin: 35, ageMax: 38, mean: 4.9, lowerQuartile: 3, upperQuartile: 5 },
      { ageMin: 38, ageMax: 41, mean: 4.1, lowerQuartile: 2, upperQuartile: 6 },
      { ageMin: 41, ageMax: 43, mean: 4.2, lowerQuartile: 3, upperQuartile: 5 },
      { ageMin: 43, ageMax: null, mean: 3.6, lowerQuartile: 2, upperQuartile: 5 },
    ],
  },
  {
    amhMin: 0.17,
    amhMax: 0.3,
    ageBands: [
      { ageMin: 0, ageMax: 35, mean: 5.8, lowerQuartile: 3, upperQuartile: 9.5 },
      { ageMin: 35, ageMax: 38, mean: 4.9, lowerQuartile: 3, upperQuartile: 7 },
      { ageMin: 38, ageMax: 41, mean: 5.6, lowerQuartile: 3, upperQuartile: 8 },
      { ageMin: 41, ageMax: 43, mean: 5.6, lowerQuartile: 3.5, upperQuartile: 7 },
      { ageMin: 43, ageMax: null, mean: 4.6, lowerQuartile: 3, upperQuartile: 5.5 },
    ],
  },
  {
    amhMin: 0.3,
    amhMax: 0.7,
    ageBands: [
      { ageMin: 0, ageMax: 35, mean: 8.6, lowerQuartile: 5, upperQuartile: 11 },
      { ageMin: 35, ageMax: 38, mean: 8.3, lowerQuartile: 5, upperQuartile: 10 },
      { ageMin: 38, ageMax: 41, mean: 7.4, lowerQuartile: 5, upperQuartile: 9 },
      { ageMin: 41, ageMax: 43, mean: 7.3, lowerQuartile: 4, upperQuartile: 9 },
      { ageMin: 43, ageMax: null, mean: 7.3, lowerQuartile: 4, upperQuartile: 9 },
    ],
  },
  {
    amhMin: 0.7,
    amhMax: 1.0,
    ageBands: [
      { ageMin: 0, ageMax: 35, mean: 11.2, lowerQuartile: 8, upperQuartile: 14 },
      { ageMin: 35, ageMax: 38, mean: 10.2, lowerQuartile: 7, upperQuartile: 13 },
      { ageMin: 38, ageMax: 41, mean: 10.1, lowerQuartile: 6, upperQuartile: 13 },
      { ageMin: 41, ageMax: 43, mean: 9.0, lowerQuartile: 6, upperQuartile: 11 },
      { ageMin: 43, ageMax: null, mean: 7.1, lowerQuartile: 4, upperQuartile: 9 },
    ],
  },
  {
    amhMin: 1.0,
    amhMax: 2.0,
    ageBands: [
      { ageMin: 0, ageMax: 35, mean: 13.4, lowerQuartile: 9, upperQuartile: 17 },
      { ageMin: 35, ageMax: 38, mean: 11.5, lowerQuartile: 8, upperQuartile: 14 },
      { ageMin: 38, ageMax: 41, mean: 11.9, lowerQuartile: 8, upperQuartile: 16 },
      { ageMin: 41, ageMax: 43, mean: 11.2, lowerQuartile: 7, upperQuartile: 14 },
      { ageMin: 43, ageMax: null, mean: 12.1, lowerQuartile: 8, upperQuartile: 16 },
    ],
  },
  {
    amhMin: 2.0,
    amhMax: 4.0,
    ageBands: [
      { ageMin: 0, ageMax: 35, mean: 15.3, lowerQuartile: 12, upperQuartile: 19 },
      { ageMin: 35, ageMax: 38, mean: 14.3, lowerQuartile: 9, upperQuartile: 17 },
      { ageMin: 38, ageMax: 41, mean: 13.5, lowerQuartile: 9, upperQuartile: 17 },
      { ageMin: 41, ageMax: 43, mean: 12.8, lowerQuartile: 8, upperQuartile: 14 },
      { ageMin: 43, ageMax: null, mean: 15.6, lowerQuartile: 10, upperQuartile: 20.5 },
    ],
  },
  {
    amhMin: 4.0,
    amhMax: null,
    ageBands: [
      { ageMin: 0, ageMax: 35, mean: 15.1, lowerQuartile: 10, upperQuartile: 20 },
      { ageMin: 35, ageMax: 38, mean: 15.9, lowerQuartile: 11, upperQuartile: 18 },
      { ageMin: 38, ageMax: 41, mean: 14.5, lowerQuartile: 9, upperQuartile: 18 },
      { ageMin: 41, ageMax: 43, mean: 15.8, lowerQuartile: 13.5, upperQuartile: 18.5 },
      { ageMin: 43, ageMax: null, mean: 12.7, lowerQuartile: 10, upperQuartile: 15 },
    ],
  },
];

export function lookupOocyteRetrieval(age: number, amh: number): OocyteRetrievalData {
  // Find the appropriate AMH band
  const amhBand = OOCYTE_RETRIEVAL_DATA.find(
    (band) => amh >= band.amhMin && (band.amhMax === null || amh < band.amhMax)
  );

  if (!amhBand) {
    // Default to lowest AMH band if out of range
    const defaultBand = OOCYTE_RETRIEVAL_DATA[0].ageBands.find(
      (b) => age >= b.ageMin && (b.ageMax === null || age < b.ageMax)
    ) ?? OOCYTE_RETRIEVAL_DATA[0].ageBands[0];

    return {
      mean: defaultBand.mean,
      lowerQuartile: defaultBand.lowerQuartile,
      upperQuartile: defaultBand.upperQuartile,
    };
  }

  // Find the appropriate age band within the AMH band
  const ageBand = amhBand.ageBands.find(
    (b) => age >= b.ageMin && (b.ageMax === null || age < b.ageMax)
  );

  if (!ageBand) {
    // Default to highest age band if age is out of range
    const defaultBand = amhBand.ageBands[amhBand.ageBands.length - 1];
    return {
      mean: defaultBand.mean,
      lowerQuartile: defaultBand.lowerQuartile,
      upperQuartile: defaultBand.upperQuartile,
    };
  }

  return {
    mean: ageBand.mean,
    lowerQuartile: ageBand.lowerQuartile,
    upperQuartile: ageBand.upperQuartile,
  };
}

// Fixed rates
export const MATURATION_RATE = 0.82; // MII rate
export const FERTILIZATION_RATE = 0.72; // 2PN rate
