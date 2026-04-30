export type DataSource = 'published' | 'uhfc';

export interface PatientInputs {
  age: number;              // 20-45
  amh: number;              // ng/mL (for IVF pathway)
  priorPregnancy: boolean;  // any prior pregnancy (drives Steiner fecundability)
  priorLiveBirth: boolean;  // prior live birth/parity (drives Magnus base miscarriage rate)
  priorMiscarriages: 0 | 1 | 2 | 3; // consecutive prior miscarriages (drives Magnus recurrence OR)
  timeHorizon: number;      // months (1-24, for spontaneous)
  dataSource: DataSource;   // 'published' or 'uhfc' for IVF embryo development
}

export interface SpontaneousResults {
  fecundability: number;
  cumulativePregnancy: number;
  miscarriageRate: number;         // base rate from age/gravidity lookup
  miscarriageRecurrenceOR: number; // OR applied (1.0 if no prior miscarriages)
  adjustedMiscarriageRate: number; // miscarriageRate adjusted by recurrence OR
  ongoingPregnancy: number;
  aneuploidyRisk: number;
  trisomy21FirstTrimester: number; // 1 in X risk at 10 weeks
  trisomy21SecondTrimester: number; // 1 in X risk in 2nd trimester
  trisomy21Delivery: number; // 1 in X risk at delivery
  healthyBaby: number;
}

export interface IVFResults {
  cycleCancellationRisk: number;
  oocytes: number;
  oocytesLowerQuartile: number;
  oocytesUpperQuartile: number;
  matureOocytes: number;
  matureOocytesLowerQuartile: number;
  matureOocytesUpperQuartile: number;
  maturationRate: number; // Age-specific maturation rate used
  fertilized: number;
  fertilizedLowerQuartile: number;
  fertilizedUpperQuartile: number;
  fertilizationRate: number; // Age-specific fertilization rate used
  blastocysts: number;
  blastocystsLowerQuartile: number;
  blastocystsUpperQuartile: number;
  euploidBlasts: number;
  euploidBlastsLowerQuartile: number;
  euploidBlastsUpperQuartile: number;
  pAtLeastOneEuploid: number;
  liveBirthPerEuploid: number;
  expectedLiveBirths: number;
  expectedLiveBirthsLowerQuartile: number;
  expectedLiveBirthsUpperQuartile: number;
  healthyBabyConditional: number; // Probability assuming retrieval succeeds
  healthyBaby: number; // Overall probability including cancellation risk
  cyclesNeededForOneEuploid: number | null; // Expected cycles needed if < 1 euploid per cycle
  lowSampleSizeWarning: boolean; // true if UHFC data used and n < 10 for this age/AMH combination
}

export interface OocyteRetrievalData {
  mean: number;
  median?: number; // UHFC data uses median instead of mean
  lowerQuartile: number;
  upperQuartile: number;
  lowSampleSize?: boolean; // UHFC data: true if n < 10
}

export interface AMHPercentileData {
  median: number;
  p25: number;
  p75: number;
  percentileDOR: number;
}
