# 🚀 SupplySense — Tonight's Run Guide
## What to do on your RTX 4050 PC (step by step)

---

## STEP 1 — Install Python dependencies (3 min)

Open a terminal on that PC and run:
```bash
pip install networkx numpy matplotlib requests
```

---

## STEP 2 — Copy the benchmark folder to that PC

Copy the entire `benchmark/` folder from this repo to the other machine.
You need these files:
- `run_real_benchmark.py`   ← the NEW real script
- `dataset.json`            ← the ground-truth data

---

## STEP 3 — Make sure Ollama is running (1 min)

Open a terminal and run:
```bash
ollama serve
```
Keep this terminal open. Open a second terminal for the next steps.

Pull the models if not already done:
```bash
ollama pull llama3
ollama pull mistral
```
(Llama3 = ~4.7 GB, Mistral = ~4.1 GB — let it download fully before running)

Confirm models are ready:
```bash
ollama list
```
You should see both `llama3` and `mistral` listed.

---

## STEP 4 — Run the real benchmark

Navigate to the benchmark folder and run:

```bash
# Run both models (recommended — takes ~30-40 min total on RTX 4050)
python run_real_benchmark.py

# OR run only Llama-3 (takes ~15-20 min)
python run_real_benchmark.py --model llama3

# OR if Ollama isn't working yet, run just the math & KG parts
python run_real_benchmark.py --skip-llm
```

---

## STEP 5 — What you'll see while it runs

The script will print something like:
```
========================================================
  SupplySense REAL Empirical Benchmark Suite
  Loaded 12 real-world disruption incidents
========================================================

[1/4] Building real networkx knowledge graph...
      Nodes: 87 | Edges: 96

[2/4] Computing delay forecasts & measuring KG traversal...
      Delay Forecast → MAE: 0.99 d | RMSE: 1.16 d
      KG Traversal   → Mean: 0.012 ms | BOM Coverage: 96.2%

[3/4] Evaluating keyword baseline...
      Keyword Baseline Accuracy: 58.3% (7/12 correct)

[4/4] Running REAL LLM inference: llama3
  [01/12] GT: Meteorological        → LLM: Meteorological        ✓  (4.2s)
  [02/12] GT: Labor & Port          → LLM: Labor & Port          ✓  (3.8s)
  ...
```

---

## STEP 6 — After it finishes, send me the output

Screenshot or copy-paste the final summary section that says:

```
================================================================
  FINAL BENCHMARK SUMMARY
================================================================
  Llama-3 Real F1     : X.XXX
  Llama-3 Mean Latency: XXX ms
  Mistral Real F1     : X.XXX
  ...
```

I will immediately update the paper tables with the real numbers.

---

## What gets created automatically:
- `fig2_lead_time_comparison.png` — updated bar chart
- `fig3_advance_warning.png` — advance warning chart
- `fig4_precision_recall_f1.png` — F1 comparison (with real numbers)
- `paper_tables.tex` — LaTeX ready to paste into Overleaf
- `results_by_category.csv` — raw data CSV

---

## ⚠️ Troubleshooting

**"Cannot connect to Ollama"** → Make sure `ollama serve` is running in another terminal

**Model download stuck** → Try `ollama pull llama3:8b` instead of `llama3`

**Out of memory** → Try: `python run_real_benchmark.py --model llama3` (one at a time)

**Very slow (CPU only)** → Normal if GPU not detected. ~4-5 min per article. Still run it overnight if needed.

---

## Tonight's Timeline Estimate

| Task | Time |
|---|---|
| pip install + model pull | ~15 min |
| Run `--skip-llm` (verify math works) | ~1 min |
| Run Llama-3 only (`--model llama3`) | ~15-20 min |
| Run Mistral (`--model mistral`) | ~15-20 min |
| **Total** | **~45-55 min** |
