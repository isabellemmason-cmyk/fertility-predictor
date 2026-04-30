import type { PatientInputs, SpontaneousResults, IVFResults } from './types';
import {
  lookupFecundability,
  lookupMiscarriage,
  getMiscarriageRecurrenceOR,
  applyMiscarriageOR,
  lookupAneuploidy,
  lookupTrisomy21FirstTrimester,
  lookupTrisomy21SecondTrimester,
  lookupTrisomy21Delivery,
  lookupBlastulation,
  lookupBlastulationUHFC,
  lookupMaturation,
  lookupFertilization,
  lookupEuploidy,
  lookupLiveBirthPerEuploid,
  lookupCycleCancellationRisk,
  lookupOocyteRetrieval,
  lookupOocyteRetrievalUHFC,
  MATURATION_RATE_UHFC,
  FERTILIZATION_RATE_UHFC,
} from './lookupTables';

/**
 * Calculate spontaneous conception outcomes
 * Pathway A: Natural conception over a time period
 */
export function calculateSpontaneous(inputs: PatientInputs): SpontaneousResults {
  // 1. Monthly fecundability (Steiner 2016 — stratified by any prior pregnancy)
  const fecundabilityGroup = inputs.priorPregnancy ? 'prior_pregnancy' : 'nulligravid';
  const fecundability = lookupFecundability(inputs.age, fecundabilityGroup);

  // 2. Cumulative pregnancy probability after N months
  // Formula: 1 - (1 - monthly_rate)^months
  const cumulativePregnancy = 1 - Math.pow(1 - fecundability, inputs.timeHorizon);

  // 3. Miscarriage rate (Magnus 2019, Table 1 — age-stratified, spontaneous only)
  const miscarriageRate = lookupMiscarriage(inputs.age);

  // 3a. Apply recurrence risk OR if patient has prior miscarriages (Magnus et al. 2019)
  const miscarriageRecurrenceOR = getMiscarriageRecurrenceOR(inputs.priorMiscarriages);
  const adjustedMiscarriageRate = applyMiscarriageOR(miscarriageRate, miscarriageRecurrenceOR);

  // 4. Ongoing pregnancy rate = cumulative pregnancy × (1 - adjusted miscarriage rate)
  const ongoingPregnancy = cumulativePregnancy * (1 - adjustedMiscarriageRate);

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
    miscarriageRecurrenceOR,
    adjustedMiscarriageRate,
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
  // Determine which data source to use
  const useUHFC = inputs.dataSource === 'uhfc';

  // 0. Cycle cancellation risk (risk of not making it to retrieval)
  // Use published data for both data sources
  const cycleCancellationRisk = lookupCycleCancellationRisk(inputs.age, inputs.amh);

  // 1. Predicted oocytes retrieved
  // Published: Reichman et al. (uses mean)
  // UHFC: Clinical cohort data 2021-2025 (uses median)
  const oocyteData = useUHFC
    ? lookupOocyteRetrievalUHFC(inputs.age, inputs.amh)
    : lookupOocyteRetrieval(inputs.age, inputs.amh);
  const oocytes = useUHFC ? (oocyteData.median ?? oocyteData.mean) : oocyteData.mean;
  const oocytesLowerQuartile = oocyteData.lowerQuartile;
  const oocytesUpperQuartile = oocyteData.upperQuartile;
  const lowSampleSizeWarning = useUHFC && (oocyteData.lowSampleSize ?? false);

  // 2. Mature oocytes (MII)
  // Published: Romanski 2022 age-specific maturation rates
  // UHFC: 77% maturation rate (constant)
  const maturationRate = useUHFC ? MATURATION_RATE_UHFC : lookupMaturation(inputs.age);
  const matureOocytes = oocytes * maturationRate;
  const matureOocytesLowerQuartile = oocytesLowerQuartile * maturationRate;
  const matureOocytesUpperQuartile = oocytesUpperQuartile * maturationRate;

  // 3. Fertilized (2PN)
  // Published: Romanski 2022 age-specific fertilization rates
  // UHFC: 83% fertilization rate (constant)
  const fertilizationRate = useUHFC ? FERTILIZATION_RATE_UHFC : lookupFertilization(inputs.age);
  const fertilized = matureOocytes * fertilizationRate;
  const fertilizedLowerQuartile = matureOocytesLowerQuartile * fertilizationRate;
  const fertilizedUpperQuartile = matureOocytesUpperQuartile * fertilizationRate;

  // 4. Blastocysts (age-specific rate)
  const blastRate = useUHFC ? lookupBlastulationUHFC(inputs.age) : lookupBlastulation(inputs.age);
  const blastocysts = fertilized * blastRate;
  const blastocystsLowerQuartile = fertilizedLowerQuartile * blastRate;
  const blastocystsUpperQuartile = fertilizedUpperQuartile * blastRate;

  // 5. Euploid blastocysts
  const euploidyRate = lookupEuploidy(inputs.age);
  const euploidBlasts = blastocysts * euploidyRate;
  const euploidBlastsLowerQuartile = blastocystsLowerQuartile * euploidyRate;
  const euploidBlastsUpperQuartile = blastocystsUpperQuartile * euploidyRate;

  // 6. P(≥1 euploid embryo)
  // Formula: 1 - (1 - euploidy_rate)^blastocysts
  const pAtLeastOneEuploid = 1 - Math.pow(1 - euploidyRate, blastocysts);

  // 7. Live birth rate per euploid transfer
  const liveBirthPerEuploid = lookupLiveBirthPerEuploid(inputs.age);

  // 8. Expected live births = euploid blasts × LB rate per euploid
  const expectedLiveBirths = euploidBlasts * liveBirthPerEuploid;
  const expectedLiveBirthsLowerQuartile = euploidBlastsLowerQuartile * liveBirthPerEuploid;
  const expectedLiveBirthsUpperQuartile = euploidBlastsUpperQuartile * liveBirthPerEuploid;

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
    matureOocytesLowerQuartile,
    matureOocytesUpperQuartile,
    maturationRate,
    fertilized,
    fertilizedLowerQuartile,
    fertilizedUpperQuartile,
    fertilizationRate,
    blastocysts,
    blastocystsLowerQuartile,
    blastocystsUpperQuartile,
    euploidBlasts,
    euploidBlastsLowerQuartile,
    euploidBlastsUpperQuartile,
    pAtLeastOneEuploid,
    liveBirthPerEuploid,
    expectedLiveBirths,
    expectedLiveBirthsLowerQuartile,
    expectedLiveBirthsUpperQuartile,
    healthyBabyConditional,
    healthyBaby,
    cyclesNeededForOneEuploid,
    lowSampleSizeWarning,
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
