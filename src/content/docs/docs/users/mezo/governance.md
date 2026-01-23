---
title: Governance
description: 'MEZO governance parameters, constraints, and future development'
topic: users
---

MEZO governance allows veBTC holders to shape protocol parameters and emission flows. Governance is anchored in BTC—veMEZO amplifies voting power but cannot vote independently.

## Governable Parameters

Through on-chain governance, veBTC holders can adjust:

| Parameter | Description | Constraint |
|---|---|---|
| Chain Splitter ratio | Share of emissions to validators vs ecosystem | ±1% per epoch max |
| Ecosystem Splitter ratio | Share of emissions to staking vs ecosystem gauges | ±1% per epoch max |
| Max boost multiplier | Maximum veMEZO boost on veBTC | Currently 5x |

## Governance Constraints

Mezo governance includes safeguards to prevent sudden changes:

- **Splitter inertia** — Splitter ratios can only move ±1% per epoch. Significant changes require sustained community support over multiple epochs.
- **BTC-anchored voting** — Only veBTC holders can vote on governance proposals. veMEZO boosts voting power but grants no independent governance rights.

## Future Development

Governance structures may evolve to include:

- Formal proposal and voting mechanisms (e.g., Governor Bravo)
- Additional governable parameters
- Validator selection via gauge voting under proof-of-stake

Details will be announced as governance features are finalized.
