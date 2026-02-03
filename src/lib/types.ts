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
  healthyBaby: number;
}

export interface IVFResults {
  oocytes: number;
  matureOocytes: number;
  fertilized: number;
  blastocysts: number;
  euploidBlasts: number;
  pAtLeastOneEuploid: number;
  liveBirthPerEuploid: number;
  expectedLiveBirths: number;
  healthyBaby: number;
}

export interface AMHPercentileData {
  median: number;
  p25: number;
  p75: number;
  percentileDOR: number;
}
