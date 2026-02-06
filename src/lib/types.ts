export type Gravidity = 'nulligravid' | 'prior_pregnancy';

export interface PatientInputs {
  age: number;           // 20-45
  amh: number;           // ng/mL (for IVF pathway)
  gravidity: Gravidity;
  timeHorizon: number;   // months (1-24, for spontaneous)
}

export interface SpontaneousResults {
  fecundability: number;
  cumulativePregnancy: number;
  miscarriageRate: number;
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
  fertilized: number;
  blastocysts: number;
  euploidBlasts: number;
  pAtLeastOneEuploid: number;
  liveBirthPerEuploid: number;
  expectedLiveBirths: number;
  healthyBabyConditional: number; // Probability assuming retrieval succeeds
  healthyBaby: number; // Overall probability including cancellation risk
}

export interface OocyteRetrievalData {
  mean: number;
  lowerQuartile: number;
  upperQuartile: number;
}

export interface AMHPercentileData {
  median: number;
  p25: number;
  p75: number;
  percentileDOR: number;
}
