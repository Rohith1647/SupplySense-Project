# SupplySense Empirical Verification & Benchmark Suite

This directory contains the ground-truth benchmark dataset, evaluation runner, generated publication figures, and empirical results tables for the paper:
**"SupplySense: Location-Aware AI for Real-Time Supply Chain Disruption Forecasting"**
*(Authors: Bharath Palanisamy Mettukadai, Ameen Basha M, S Rohith - Vellore Institute of Technology, Vellore)*

---

## 1. Quick Reproduction
To re-run the entire empirical verification suite and regenerate all tables and figures:
```bash
python benchmark/run_benchmark.py
```

---

## 2. Benchmark Corpus Overview (`dataset.json`)
The evaluation corpus contains 12 documented real-world international supply chain disruption episodes with empirical ground truth:
- **Meteorological**: 2024 Typhoon Yagi (Yantian / Shenzhen), Cyclone Michaung (Chennai), Bangalore industrial corridor flooding.
- **Labor & Port**: 2023 Rotterdam Maasvlakte strike, Port of Los Angeles appointment outage, Hamburg Elbe River pilot strike.
- **Geopolitical**: Red Sea / Bab-el-Mandeb commercial divergence, Taiwan Strait military navigation exclusion zones.
- **Environmental & Infrastructure**: Panama Canal Gatun Lake drought restrictions, Baltimore Key Bridge collapse, Birgunj/Tatopani Nepal customs gate backlogs, Stuttgart high-bay substation surge.

---

## 3. Verified Quantitative Results

### A. Lead-Time Delay Forecast Accuracy & Advance Warning Window
*(Generated from `run_benchmark.py`)*

| Disruption Category | Actual Mean Delay (d) | ERP Lag (d) | SupplySense Forecast $\Delta T$ (d) | MAE (d) | RMSE (d) | Advance Warning Window Ahead of ERP |
|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| **Meteorological** | 5.8 | 1.2 | 5.9 | **0.80** | 0.86 | **+4.8 days earlier** |
| **Labor & Port** | 7.1 | 1.2 | 8.3 | **1.28** | 1.34 | **+5.9 days earlier** |
| **Geopolitical** | 12.0 | 1.2 | 11.0 | **0.97** | 1.27 | **+10.5 days earlier** |
| **Environmental** | 12.8 | 1.2 | 11.3 | **1.48** | 1.48 | **+10.2 days earlier** |
| **Infrastructure** | 9.5 | 1.2 | 10.0 | **0.74** | 1.03 | **+8.1 days earlier** |
| **Overall Micro-Average** | **8.7** | **1.4** | **8.8** | **0.99** | **1.16** | **+7.3 days earlier** |

- **SupplySense Delay MAE**: **0.99 days** vs. Legacy ERP Error of **7.12 days**.
- **Average Early Warning Window**: **+7.31 days ahead of carrier notices**.
- **Knowledge Graph Traversal Latency**: **12.90 ms** for full multi-tier BOM resolution.

---

## 4. Generated Publication Visual Assets
- [Figure 2: Lead-Time Delay Forecast vs Actual](fig2_lead_time_comparison.png)
- [Figure 3: Advance Warning Window by Category](fig3_advance_warning.png)
- [Figure 4: NLP Threat Extraction F1-Score Comparison](fig4_precision_recall_f1.png)
- [LaTeX Publication Tables](paper_tables.tex)
- [Category Breakdown CSV](results_by_category.csv)
