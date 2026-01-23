---
title: Emissions Schedule
description: MEZO emissions model with Bitcoin-inspired halving and distribution flow
topic: users
---

MEZO follows a Bitcoin-inspired emissions model with predictable, declining inflation. In this way, early users who commit and max-lock their MEZO stake will benefit the most from the planned MEZO emission schedule.

| Phase | Timeline | Emission Rate |
|---|---|---|
| Bootstrap | Years 0–2 | 25% → 12.5% |
| Growth | Years 2–4 | 12.5% → 6.25% |
| Maturity | Years 4–8 | 6.25% → 2% |
| Perpetuity | Years 8+ | 2% (terminal) |

![MEZO Emissions Schedule](/docs/images/mezo-token/mezo-emissions.png)

## Key Features

**Bitcoin-Inspired Halving** — Emission rate halves every 2 years, creating predictable supply expansion.

**2% Tail Emissions** — After year 8, emissions stabilize at 2% annually to maintain long-term incentives.

**Rebase Protection** — Locked veMEZO receives proportional emissions to offset dilution.

## How Emissions Are Distributed

Weekly emissions flow through a governed splitter system:

1. **Rebase vs. Rewards** — A portion goes to veMEZO holders as anti-dilution rebases; the remainder flows to the "Chain Splitter" as emission rewards.
2. **Chain Splitter** — Rewards are split between validators and the ecosystem.
3. **Ecosystem Splitter** — Ecosystem rewards are split between staking gauges and non-staking ecosystem gauges.
4. **Gauge Voting** — Within each branch, veBTC holders vote to direct emissions to specific gauges.

Splitter ratios (Chain Splitter and Ecosystem Splitter) can shift by a maximum of 1% per epoch, ensuring gradual transitions.

![MEZO Emissions Flow](/docs/images/mezo-token/mezo-emissions-flow.png)

### Emissions Flow Breakdown

1. **Weekly MEZO Emissions** follow a predetermined schedule. Each week, the protocol mints a fixed amount of MEZO according to this schedule.

2. **Rebase** protects veMEZO holders from dilution. The rebase share is dynamic—when few tokens are locked, rebase is high (up to 50% of emissions) to incentivize locking. As more MEZO is locked, the rebase share shrinks and more flows to rewards. This shifts the system from paying people to hold to paying people to participate by voting.

3. **Chain Splitter** governs how much goes to validators versus the rest of the ecosystem. The default is 20% to validators, 80% to the ecosystem. veBTC holders can vote to adjust this ratio, but it can only move ±1% per epoch to prevent sudden shifts.

4. **Validators** operate Mezo chain nodes. They receive MEZO emissions based on delegated vote weight and may (but are not required to) share rewards with delegators or repost them as incentives.

5. **Ecosystem Splitter** divides the remaining 80% between staking gauges (90%) and non-staking ecosystem gauges (10%). Like the Chain Splitter, this ratio is governable with ±1% movement per epoch.

6. **Staking Gauges** receive the largest share of emissions (~72% net). LPs who stake their LP tokens and MUSD savers who stake their receipt tokens earn MEZO here. In exchange, they give up direct trading fees—those flow to veBTC voters instead.

7. **Ecosystem Gauges** support grants, partner protocols, and ecosystem development (~8% net). These non-staking gauges allow governance to fund initiatives that grow Mezo without requiring recipients to provide liquidity.
