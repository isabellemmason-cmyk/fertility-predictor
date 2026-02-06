# REI Fertility Calculator

A web-based tool for reproductive endocrinology practitioners to compare fertility outcomes between spontaneous conception and IVF + PGT-A pathways.

**Live Demo**: [https://isabellemmason-cmyk.github.io/fertility-predictor/](https://isabellemmason-cmyk.github.io/fertility-predictor/)

## Features

- **Patient Input Form**: Age, AMH, gravidity status, and time horizon
- **AMH Percentile Display**: Visual comparison against age-matched population norms
- **Dual Pathway Analysis**:
  - **Pathway A**: Spontaneous conception probability over time
  - **Pathway B**: IVF + PGT-A single cycle outcomes
- **Full Pipeline Visibility**: See all intermediate calculations, not just final results
- **Side-by-Side Comparison**: Understand the relative advantage of each approach

## Screenshot

The calculator displays:
- Monthly fecundability → Cumulative pregnancy → Ongoing pregnancy → Healthy baby (spontaneous)
- Oocytes → MII → 2PN → Blastocysts → Euploid embryos → Live birth (IVF)

## Data Sources

All calculations are based on peer-reviewed clinical research:

| Parameter | Source |
|-----------|--------|
| Oocyte retrieval | Reichman et al. |
| Spontaneous fecundability | Steiner et al., 2016 |
| Miscarriage rates | Magnus et al., 2019 |
| Aneuploidy risk | ACOG, 2020 |
| Blastulation rates | Romanski et al., 2022 |
| Euploidy rates | Franasiak et al., 2014 |
| Live birth per euploid | Yan et al., 2021; Linder et al., 2025 |
| AMH reference data | Aslan et al., 2025 (n=22,920) |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/isabellemmason-cmyk/fertility-predictor.git
cd fertility-predictor
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173/fertility-predictor/](http://localhost:5173/fertility-predictor/)

### Production Build

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS v4

## Disclaimer

This calculator is for educational and counseling purposes only. Results are estimates based on population-level data and may not reflect individual outcomes. Always discuss fertility options with a qualified reproductive endocrinologist.

## License

MIT
