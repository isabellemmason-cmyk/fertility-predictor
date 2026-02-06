# REI Fertility Calculator - Project Context

## Overview

This is a React/TypeScript web application for reproductive endocrinology practitioners to compare fertility outcomes between two pathways:
- **Pathway A**: Unassisted Conception (natural conception over time)
- **Pathway B**: IVF + PGT-A (single cycle with preimplantation genetic testing)

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Deployment**: GitHub Pages via `gh-pages` package

## Project Structure

```
src/
├── components/
│   ├── PatientInputForm.tsx    # Age, AMH, gravidity, time horizon inputs
│   ├── AMHPercentile.tsx       # Visual AMH percentile vs age-matched norms
│   ├── SpontaneousResults.tsx  # Pathway A full pipeline display
│   ├── IVFResults.tsx          # Pathway B full pipeline display
│   └── ComparisonSummary.tsx   # Side-by-side outcome comparison
├── lib/
│   ├── types.ts                # TypeScript interfaces
│   ├── lookupTables.ts         # All reference data from clinical studies
│   └── calculations.ts         # Prediction formulas for both pathways
├── App.tsx                     # Main app assembly
├── main.tsx                    # React entry point
└── index.css                   # Tailwind imports
```

## Key Calculations

### Unassisted Conception (Pathway A)
```
Monthly Fecundability (Steiner 2016)
    ↓
Cumulative Pregnancy = 1 - (1 - fecundability)^months
    ↓
Miscarriage Rate (Magnus 2019)
    ↓
Ongoing Pregnancy = Cumulative × (1 - Miscarriage)
    ↓
Aneuploidy Risk (ACOG 2020)
    ↓ (displayed alongside)
Trisomy 21 Risk at 1st tri, 2nd tri, delivery (Snijders 1999)
    ↓
Healthy Baby = Ongoing × (1 - Aneuploidy)
```

### IVF + PGT-A (Pathway B)
```
Cycle Cancellation Risk(age, AMH)  [Clinical data]
    ↓
Predicted Oocytes = lookup(Age, AMH)  [Reichman et al.]
    ↓
Mature (MII) = Oocytes × Maturation_Rate(age)  [REI Calculator, 3 Oocyte_Embryo_Development]
    ↓
Fertilized (2PN) = MII × Fertilization_Rate(age)  [REI Calculator, 3 Oocyte_Embryo_Development]
    ↓
Blastocysts = 2PN × Blastulation_Rate(age)  [REI Calculator, 3 Oocyte_Embryo_Development]
    ↓
Euploid Blasts = Blastocysts × Euploidy_Rate(age)  [REI Calculator, 2 Euploidy_Rates]
    ↓
Conditional Healthy Baby = Euploid_Blasts × Live_Birth_Per_Euploid(age)  [REI Calculator, 4 LiveBirth_Per_Euploid]
    ↓
Overall Healthy Baby = (1 - Cycle_Cancellation_Risk) × Conditional_Healthy_Baby
                     = P(Retrieval Succeeds) × Euploid_Blasts × Live_Birth_Per_Euploid
```

**Key Concept**: The cycle cancellation risk represents the probability that the patient never makes it to oocyte retrieval. This is factored into the final outcome as an independent preceding event that must succeed before the IVF pipeline probabilities apply.

## Data Sources

All lookup tables in `src/lib/lookupTables.ts` are derived from:

| Data | Source | Notes |
|------|--------|-------|
| Cycle cancellation risk | Clinical data | Risk of not making it to retrieval, stratified by age and AMH |
| Oocyte retrieval | Reichman et al. | Mean, lower/upper quartiles by age and AMH from "Value of antimüllerian hormone as a prognostic indicator of in vitro fertilization outcome" |
| Maturation rates | REI Calculator Data Extraction | Age-specific, from tab "3 Oocyte_Embryo_Development", column "maturation %" |
| Fertilization rates | REI Calculator Data Extraction | Age-specific, from tab "3 Oocyte_Embryo_Development", column "fertilization %" |
| Blastulation rates | REI Calculator Data Extraction | Age-specific, from tab "3 Oocyte_Embryo_Development", column "blastulation %", per fertilized oocyte (2PN) |
| Euploidy rates | REI Calculator Data Extraction | Age-specific, from tab "2 Euploidy_Rates" |
| Live birth per euploid | REI Calculator Data Extraction | Age-banded, from tab "4 LiveBirth_Per_Euploid" |
| Spontaneous fecundability | Steiner 2016 | Stratified by gravidity |
| Miscarriage rates | Magnus 2019 | Stratified by parity |
| Aneuploidy risk | ACOG 2020 | Chromosomal anomaly at delivery |
| Trisomy 21 risk | Snijders et al. 1999 | Age-stratified risk (1 in X) at 1st trimester (10 weeks), 2nd trimester, and delivery. From REI Calculator Data Extraction, tab "7_Spontaneous_Outcomes" |
| AMH reference | Aslan 2025 | n=22,920, percentiles by age |

## Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run deploy   # Deploy to GitHub Pages
```

## Deployment

The app deploys to GitHub Pages at the `/fertility-predictor/` base path. The Vite config sets `base: '/fertility-predictor/'` to handle this.

## Known Considerations

1. **Cycle Cancellation Risk Integration**: The cycle cancellation risk is treated as an independent preceding event in the IVF pathway. The final "Healthy Baby Probability" is calculated as:
   - `Conditional Probability = P(≥1 euploid) × Live_Birth_Per_Euploid` (assuming retrieval succeeds)
   - `Overall Probability = (1 - Cancellation_Risk) × Conditional_Probability`

   This properly accounts for the risk that a patient may never make it to oocyte retrieval, which is particularly important for patients with poor ovarian reserve.

2. **AMH Percentile Visualization**: The marker position interpolates between fixed percentile positions (25%, 50%, 75%) based on the patient's AMH value relative to age-matched reference data.

3. **Age Banding**: Different data sources use different age bands. The lookup functions find the appropriate band for each age input. Cycle cancellation risk uses both age and AMH bands (6 AMH ranges × 5 age ranges).

4. **Calculation Verification**: Test cases were verified against the source Excel spreadsheet (e.g., Age 35, AMH 2, Nulligravid, 12 months). The cycle cancellation integration can be verified by checking that patients with higher cancellation risk show proportionally lower overall outcomes.
