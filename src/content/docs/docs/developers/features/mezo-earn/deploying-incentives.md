---
title: Deploying Incentives
description: How to create voting gauges for whitelisted pool assets on Mezo Earn.
topic: developers
---

All Mezo assets (BTC, MEZO, and mainnet contract tokens) have been whitelisted in the PoolsVoter contract. Anyone can now create voting gauges for pools whose both assets are on the whitelist.

For a full list of whitelisted token addresses that can be added as incentives on the gauges, see the [Contracts Reference](/docs/users/resources/contracts-reference#portal-contract-addresses).

## Creating a Pool Gauge

1. Go to the [PoolsVoter contract on the Mezo Explorer](https://explorer.mezo.org/address/0x48233cCC97B87Ba93bCA212cbEe48e3210211f03) and connect your wallet.

2. Click the **Contract** tab, then select **Write proxy** and choose `createPoolGauge`.

3. For the `_poolFactory` parameter, use one of the following addresses:
   - **Basic pools:** `0x83FE469C636C4081b87bA5b3Ae9991c6Ed104248`
   - **CL pools:** `0xBB24AF5c6fB88F1d191FA76055e30BF881BeEb79`

4. Enter the pool address under `_pool`.

5. Execute the transaction. If the pool is listed in the pools overview, it should start appearing in the vote UI as well.
