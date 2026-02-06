import type { PatientInputs, SpontaneousResults, IVFResults } from './types';
import {
  lookupFecundability,
  lookupMiscarriage,
  lookupAneuploidy,
  lookupTrisomy21FirstTrimester,
  lookupTrisomy21SecondTrimester,
  lookupTrisomy21Delivery,
  lookupBlastulation,
  lookupEuploidy,
  lookupLiveBirthPerEuploid,
  lookupCycleCancellationRisk,
  lookupOocyteRetrieval,
  MATURATION_RATE,
  FERTILIZATION_RATE,
} from './lookupTables';

/**
 * Calculate spontaneous conception outcomes
 * Pathway A: Natural conception over a time period
 */
export function calculateSpontaneous(inputs: PatientInputs): SpontaneousResults {
  // 1. Monthly fecundability (lookup by age + gravidity)
  const fecundability = lookupFecundability(inputs.age, inputs.gravidity);

  // 2. Cumulative pregnancy probability after N months
  // Formula: 1 - (1 - monthly_rate)^months
  const cumulativePregnancy = 1 - Math.pow(1 - fecundability, inputs.timeHorizon);

  // 3. Miscarriage rate (lookup by age + parity)
  const miscarriageRate = lookupMiscarriage(inputs.age, inputs.gravidity);

  // 4. Ongoing pregnancy rate = cumulative pregnancy × (1 - miscarriage rate)
  const ongoingPregnancy = cumulativePregnancy * (1 - miscarriageRate);

  // 5. Aneuploidy risk at delivery
  const aneuploidyRisk = lookupAneuploidy(inputs.age);

  // 6. Trisomy 21 risks at different time points
  const trisomy21FirstTrimester = lookupTrisomy21FirstTrimester(inputs.age);
  const trisomy21SecondTrimester = lookupTrisomy21SecondTrimester(inputs.age);
  const trisomy21Delivery = lookupTrisomy21Delivery(inputs.age);

  // 7. Final healthy baby probability = ongoing pregnancy × (1 - aneuploidy risk)
  const healthyBaby = ongoingPregnancy * (1 - aneuploidyRisk);

  return {
    fecundability,
    cumulativePregnancy,
    miscarriageRate,
    ongoingPregnancy,
    aneuploidyRisk,
    trisomy21FirstTrimester,
    trisomy21SecondTrimester,
    trisomy21Delivery,
    healthyBaby,
  };
}

/**
 * Calculate IVF + PGT-A outcomes
 * Pathway B: IVF with preimplantation genetic testing
 */
export function calculateIVF(inputs: PatientInputs): IVFResults {
  // 0. Cycle cancellation risk (risk of not making it to retrieval)
  const cycleCancellationRisk = lookupCycleCancellationRisk(inputs.age, inputs.amh);

  // 1. Predicted oocytes retrieved (Reichman et al.)
  // Based on clinical data stratified by AMH and age
  const oocyteData = lookupOocyteRetrieval(inputs.age, inputs.amh);
  const oocytes = oocyteData.mean;
  const oocytesLowerQuartile = oocyteData.lowerQuartile;
  const oocytesUpperQuartile = oocyteData.upperQuartile;

  // 2. Mature oocytes (MII) - 82% maturation rate
  const matureOocytes = oocytes * MATURATION_RATE;

  // 3. Fertilized (2PN) - 72% fertilization rate
  const fertilized = matureOocytes * FERTILIZATION_RATE;

  // 4. Blastocysts (age-specific rate)
  const blastRate = lookupBlastulation(inputs.age);
  const blastocysts = fertilized * blastRate;

  // 5. Euploid blastocysts
  const euploidyRate = lookupEuploidy(inputs.age);
  const euploidBlasts = blastocysts * euploidyRate;

  // 6. P(≥1 euploid embryo)
  // Formula: 1 - (1 - euploidy_rate)^blastocysts
  const pAtLeastOneEuploid = 1 - Math.pow(1 - euploidyRate, blastocysts);

  // 7. Live birth rate per euploid transfer
  const liveBirthPerEuploid = lookupLiveBirthPerEuploid(inputs.age);

  // 8. Expected live births = euploid blasts × LB rate per euploid
  const expectedLiveBirths = euploidBlasts * liveBirthPerEuploid;

  // 9. Conditional healthy baby probability (assuming retrieval succeeds)
  // This is P(≥1 euploid) × LB rate per euploid, given that retrieval happens
  const healthyBabyConditional = pAtLeastOneEuploid * liveBirthPerEuploid;

  // 10. Overall healthy baby probability (accounting for cycle cancellation)
  // Must factor in the probability that retrieval actually happens
  // P(healthy baby) = P(retrieval succeeds) × P(≥1 euploid) × P(LB | euploid)
  const pRetrievalSucceeds = 1 - cycleCancellationRisk;
  const healthyBaby = pRetrievalSucceeds * healthyBabyConditional;

  // 11. Cycles needed to obtain one euploid embryo (if < 1 per cycle)
  const cyclesNeededForOneEuploid = euploidBlasts < 1 ? 1 / euploidBlasts : null;

  return {
    cycleCancellationRisk,
    oocytes,
    oocytesLowerQuartile,
    oocytesUpperQuartile,
    matureOocytes,
    fertilized,
    blastocysts,
    euploidBlasts,
    pAtLeastOneEuploid,
    liveBirthPerEuploid,
    expectedLiveBirths,
    healthyBabyConditional,
    healthyBaby,
    cyclesNeededForOneEuploid,
  };
}

/**
 * Format a number as a percentage string
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format a number with fixed decimals
 */
export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals);
}
