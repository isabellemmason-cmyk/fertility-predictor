import type { PatientInputs, SpontaneousResults, IVFResults } from './types';
import {
  lookupFecundability,
  lookupMiscarriage,
  lookupAneuploidy,
  lookupBlastulation,
  lookupEuploidy,
  lookupLiveBirthPerEuploid,
  OOCYTE_MODEL,
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

  // 6. Final healthy baby probability = ongoing pregnancy × (1 - aneuploidy risk)
  const healthyBaby = ongoingPregnancy * (1 - aneuploidyRisk);

  return {
    fecundability,
    cumulativePregnancy,
    miscarriageRate,
    ongoingPregnancy,
    aneuploidyRisk,
    healthyBaby,
  };
}

/**
 * Calculate IVF + PGT-A outcomes
 * Pathway B: IVF with preimplantation genetic testing
 */
export function calculateIVF(inputs: PatientInputs): IVFResults {
  // 1. Predicted oocytes (La Marca 2012 Model 1)
  // Formula: ln(oocytes) = 3.21 - 0.036×Age + 0.089×AMH
  const lnOocytes =
    OOCYTE_MODEL.intercept -
    OOCYTE_MODEL.ageCoefficient * inputs.age +
    OOCYTE_MODEL.amhCoefficient * inputs.amh;
  const oocytes = Math.exp(lnOocytes);

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

  // 9. Final healthy baby probability
  // Simplified as P(≥1 euploid) × LB rate per euploid
  const healthyBaby = pAtLeastOneEuploid * liveBirthPerEuploid;

  return {
    oocytes,
    matureOocytes,
    fertilized,
    blastocysts,
    euploidBlasts,
    pAtLeastOneEuploid,
    liveBirthPerEuploid,
    expectedLiveBirths,
    healthyBaby,
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
