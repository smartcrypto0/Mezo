---
title: MUSD Redemptions
topic: developers
---

# How to Redeem MUSD on Mezo

## Quick Overview
Redeeming lets you burn MUSD to receive BTC at a 1:1 ratio (minus a 0.75% redemption fee). The system redeems from the trove with the lowest collateral ratio first.

---

## Step-by-Step Guide

### 1. Navigate to the Contract
Go to the **TroveManager** contract on your block explorer:
- **Mainnet**: `0xa57c03F2E0fF9F059802eEE44CcFf090a7DD4189`
- **Testnet**: `0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0`

Click on the **"Write Contract"** or **"Write as Proxy"** tab.

### 2. Find the `redeemCollateral` Function
Scroll to function **`11. redeemCollateral`**

### 3. Fill in the Parameters

Here's what each field means and how to fill it:

#### **_amount (uint256)**
The amount of MUSD you want to redeem **in wei** (18 decimals).

**Examples:**
- To redeem 100 MUSD: `100000000000000000000` (100 × 10^18)
- To redeem 1,000 MUSD: `1000000000000000000000` (1000 × 10^18)
- To redeem 5,005 MUSD: `5005000000000000000000` (5005 × 10^18)

**Quick conversion:** Amount × 1000000000000000000

#### **_firstRedemptionHint (address)**
The address of the first trove to redeem from. 

**How to get it:**
1. Go to the **HintHelpers** contract:
   - Mainnet: `0x82AB5F02993bF312d9acA03157f26FeBEBc76108`
   - Testnet: `0x4e4cBA3779d56386ED43631b4dCD6d8EacEcBCF6`
2. Call `getRedemptionHints()` with:
   - `_amount`: Same amount as above
   - `_price`: Current BTC price (get from PriceFeed contract)
   - `_maxIterations`: `50` (good default)
3. Copy the `firstRedemptionHint` value returned

**Shortcut:** Use `0x0000000000000000000000000000000000000000` if you're unsure - the contract will find it automatically (but uses more gas).

#### **_upperPartialRedemptionHint (address)**
#### **_lowerPartialRedemptionHint (address)**
These tell the system where to reinsert a partially redeemed trove in the sorted list.

**How to get them:**
1. Get `partialRedemptionHintNICR` from HintHelpers (see above)
2. Go to the **SortedTroves** contract:
   - Mainnet: `0x19868D388668A8e248784E78b0C644b517feBaAE`
   - Testnet: `0x722E4D24FD6Ff8b0AC679450F3D91294607268fA`
3. Call `findInsertPosition()` with:
   - `_NICR`: The `partialRedemptionHintNICR` value
   - `_prevId`: Your wallet address
   - `_nextId`: Your wallet address
4. Copy the two addresses returned

**Shortcut:** Use your wallet address for both if unsure (less optimal but works).

#### **_partialRedemptionHintNICR (uint256)**
The nominal interest rate that the last trove will have after partial redemption.

**How to get it:** From HintHelpers `getRedemptionHints()` - it returns this value.

**Shortcut:** Use `1100000000000000000000` (110% in 18 decimals) as a safe default.

#### **_maxIterations (uint256)**
Maximum number of troves to loop through. Prevents running out of gas.

**Recommended values:**
- `0` = unlimited (only use for small redemptions)
- `10` = safe for most redemptions
- `50` = for large redemptions
- `100` = maximum recommended

---

## Complete Example: Redeeming 100 MUSD

Let's say you want to redeem 100 MUSD:

### Option A: Using Hints (Optimal - Lower Gas)

**Step 1:** Get hints from HintHelpers
Call getRedemptionHints with:

_amount: 100000000000000000000
_price: [current BTC price from PriceFeed]
_maxIterations: 50

Returns:

firstRedemptionHint: 0xABC...123
partialRedemptionHintNICR: 1234567890123456789000
truncatedAmount: 100000000000000000000


**Step 2:** Get position hints from SortedTroves
Call findInsertPosition with:

_NICR: 1234567890123456789000
_prevId: [your address]
_nextId: [your address]

Returns:

upper: 0xDEF...456
lower: 0xGHI...789


**Step 3:** Call redeemCollateral
_amount: 100000000000000000000
_firstRedemptionHint: 0xABC...123
_upperPartialRedemptionHint: 0xDEF...456
_lowerPartialRedemptionHint: 0xGHI...789
_partialRedemptionHintNICR: 1234567890123456789000
_maxIterations: 50

### Option B: Quick & Simple (Higher Gas)
_amount: 100000000000000000000
_firstRedemptionHint: 0x0000000000000000000000000000000000000000
_upperPartialRedemptionHint: [your wallet address]
_lowerPartialRedemptionHint: [your wallet address]
_partialRedemptionHintNICR: 1100000000000000000000
_maxIterations: 10

---

## What You'll Receive

**If redeeming 100 MUSD:**
- You burn: 100 MUSD
- You receive: ~$99.25 worth of BTC (0.75% fee goes to PCV)
- Redemption fee: ~$0.75 worth of BTC

**Actual BTC received** = (100 MUSD ÷ BTC Price) × 0.9925

---

## Before You Redeem - Important Checks

### Check Prerequisites

**1. Check the TCR (Total Collateral Ratio)**
- Go to TroveManager contract → Read functions
- Call `getTCR()` with current BTC price
- **Must be ≥ 110%** (shown as `1100000000000000000` in wei)
- If below 110%, redemptions are disabled

**2. Check Your MUSD Balance**
- Go to MUSD token contract:
  - Mainnet: `0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186`
  - Testnet: `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503`
- Call `balanceOf([your address])`
- Ensure you have enough MUSD

**3. Check Current Redemption Fee**
- Go to BorrowerOperations:
  - Mainnet: `0x44b1bac67dDA612a41a58AAf779143B181dEe031`
  - Testnet: `0xCdF7028ceAB81fA0C6971208e83fa7872994beE5`
- Call `getRedemptionRate()` with your redemption amount
- Returns fee in basis points (75 = 0.75%)

### Useful View Functions

**See how much you'll get:**
HintHelpers.getRedemptionHints(amount, price, maxIterations)

Check the truncatedAmount - this is max you can actually redeem


**Check if any troves are redeemable:**
SortedTroves.getLast()

Get the last trove (lowest collateral ratio)
TroveManager.getCurrentICR(troveAddress, currentPrice)
If ICR < 110%, that trove can't be redeemed from


---

## Common Issues & Solutions

### "Cannot redeem when TCR < MCR"
**Solution:** Wait until the Total Collateral Ratio is above 110%. Check with `getTCR()`.

### "Unable to redeem any amount"
**Solution:** All troves have collateral ratios below 110%. Try again later.

### Transaction fails with "out of gas"
**Solution:** 
- Reduce `_maxIterations` to a smaller number (try 10)
- Or split your redemption into multiple smaller transactions

### Hints are outdated
**Solution:** Generate fresh hints immediately before calling redeemCollateral. If someone else redeems between getting hints and your transaction, your hints become stale.

### Received less BTC than expected
**Explanation:** This is normal if you're partially redeeming the last trove and it would go below the 1,800 MUSD minimum. The system returns unused MUSD to you.

---

## Gas Optimization Tips

1. **Use fresh hints** - Always get hints right before redeeming for best gas efficiency
2. **Set appropriate maxIterations** - Higher = more gas, but completes larger redemptions
3. **Redeem during low activity** - Less chance of hints becoming stale
4. **Consider breaking large redemptions** into chunks of 10-20 troves worth

---

## After Redemption

**What happens:**
1. Your MUSD is burned from your wallet
2. BTC is sent to your wallet (minus 0.75% fee)
3. Redemption fee (in BTC) is sent to the PCV contract
4. Redeemed troves have their debt cancelled and collateral reduced
5. If a trove is fully redeemed, excess collateral goes to CollSurplusPool

**Check your transaction:**
- Look for the `Redemption` event in the transaction logs
- You'll see: amount redeemed, collateral drawn, and fee paid

---

## Contract Addresses

### Mainnet
| Contract | Address |
|----------|---------|
| TroveManager | `0xa57c03F2E0fF9F059802eEE44CcFf090a7DD4189` |
| HintHelpers | `0x82AB5F02993bF312d9acA03157f26FeBEBc76108` |
| SortedTroves | `0x19868D388668A8e248784E78b0C644b517feBaAE` |
| BorrowerOperations | `0x44b1bac67dDA612a41a58AAf779143B181dEe031` |
| PriceFeed | `0xc5aC5A8892230E0A3e1c473881A2de7353fFcA88` |
| MUSD Token | `0xdD468A1DDc392dcdbEf6db6e34E89AA338F9F186` |

### Testnet
| Contract | Address |
|----------|---------|
| TroveManager | `0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0` |
| HintHelpers | `0x4e4cBA3779d56386ED43631b4dCD6d8EacEcBCF6` |
| SortedTroves | `0x722E4D24FD6Ff8b0AC679450F3D91294607268fA` |
| BorrowerOperations | `0xCdF7028ceAB81fA0C6971208e83fa7872994beE5` |
| PriceFeed | `0x86bCF0841622a5dAC14A313a15f96A95421b9366` |
| MUSD Token | `0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503` |

---

## Need Help?

- **Check transaction status** on the block explorer
- **View events** in your transaction to see exactly what happened
- **Join our Discord** for real-time support: [INSERT LINK]
