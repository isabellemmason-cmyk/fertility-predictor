# REI Fertility Calculator - Project Context

## Overview

This is a React/TypeScript web application for reproductive endocrinology practitioners to compare fertility outcomes between two pathways:
- **Pathway A**: Spontaneous Conception (natural conception over time)
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

### Spontaneous Conception (Pathway A)
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
    ↓
Healthy Baby = Ongoing × (1 - Aneuploidy)
```

### IVF + PGT-A (Pathway B)
```
Predicted Oocytes = exp(3.21 - 0.036×Age + 0.089×AMH)  [La Marca 2012]
    ↓
Mature (MII) = Oocytes × 0.82
    ↓
Fertilized (2PN) = MII × 0.72
    ↓
Blastocysts = 2PN × Blastulation_Rate(age)  [Romanski 2022]
    ↓
Euploid Blasts = Blastocysts × Euploidy_Rate(age)  [Franasiak 2014]
    ↓
P(≥1 Euploid) = 1 - (1 - Euploidy_Rate)^Blastocysts
    ↓
Healthy Baby = P(≥1 Euploid) × Live_Birth_Per_Euploid(age)  [Yan 2021, Linder 2025]
```

## Data Sources

All lookup tables in `src/lib/lookupTables.ts` are derived from:

| Data | Source | Notes |
|------|--------|-------|
| Oocyte prediction | La Marca 2012 | Model 1: ln(oocytes) = 3.21 - 0.036×age + 0.089×AMH |
| Spontaneous fecundability | Steiner 2016 | Stratified by gravidity |
| Miscarriage rates | Magnus 2019 | Stratified by parity |
| Aneuploidy risk | ACOG 2020 | Chromosomal anomaly at delivery |
| Blastulation rates | Romanski 2022 | Age-specific |
| Euploidy rates | Franasiak 2014 | Gold standard, n=15,169 blastocysts |
| Live birth per euploid | Yan 2021, Linder 2025 | Age-banded |
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

1. **AMH Percentile Visualization**: The marker position interpolates between fixed percentile positions (25%, 50%, 75%) based on the patient's AMH value relative to age-matched reference data.

2. **Age Banding**: Different data sources use different age bands. The lookup functions find the appropriate band for each age input.

3. **Calculation Verification**: Test cases were verified against the source Excel spreadsheet (e.g., Age 35, AMH 2, Nulligravid, 12 months).
