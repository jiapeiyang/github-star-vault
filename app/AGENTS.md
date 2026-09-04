# Star Vault App Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Treat `public/data/*.json` as generated files from the repository root. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact. Before handoff, run `npm test`, `npm run build`, and `npm run test:sites`.

## Durable visual direction

- Use方案 E“开发者杂志”作为后续视觉基线。
- Keep a near-white and true-black palette with one vivid magenta accent.
- Use bold contemporary sans typography, monospace repository names, asymmetric editorial columns, thin rules, and large real owner avatars.
- Keep classification prominent and visibly separate GitHub facts, automatic suggestions, and personal learning content.
- Do not drift back to dashboard KPI cards, glassmorphism, gradients, rainbow categories, or generic equal-card grids.
