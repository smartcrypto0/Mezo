---
title: MUSD Development Guide
description: >-
  Complete guide for developing with MUSD, the Bitcoin-backed stablecoin on
  Mezo.
topic: developers
---

# MUSD Development Guide

MUSD (Mezo USD) is a Bitcoin-backed stablecoin that provides a stable value store while maintaining Bitcoin's security and decentralization. This guide covers how to integrate and develop with MUSD contracts.

## Overview

MUSD is designed to be:
- **Bitcoin-backed**: Collateralized by Bitcoin deposits
- **Stable**: Maintains 1:1 peg with USD
- **Decentralized**: No central authority controls issuance
- **Transparent**: All operations are on-chain and verifiable

### Key Features

- **Minting**: Create MUSD by depositing Bitcoin collateral
- **Redemption**: Redeem MUSD for Bitcoin collateral
- **Liquidation**: Third-party liquidation bots monitor and liquidate undercollateralized positions to maintain system health
- **Governance**: Community-driven parameter updates

## Repository Structure

The [MUSD repository](https://github.com/mezo-org/musd.git) contains:

- **[Smart Contracts](https://github.com/mezo-org/musd/tree/main/contracts)**: Core MUSD protocol contracts
- **[Integration Examples](https://github.com/mezo-org/musd/tree/main/examples)**: Sample implementations
- **[Testing Suite](https://github.com/mezo-org/musd/tree/main/test)**: Comprehensive test coverage
- **[Documentation](https://github.com/mezo-org/musd/tree/main/docs)**: Technical specifications

## Development Setup

### Prerequisites

- Node.js 18+ (check [`.nvmrc`](https://github.com/mezo-org/musd/blob/main/.nvmrc) for exact version)
- pnpm package manager
- Foundry for smart contract development
- Git
- Mezo testnet access

### Installation

1. Clone the repository:
```bash
git clone https://github.com/mezo-org/musd.git
cd musd
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Compile contracts:
```bash
pnpm compile
```

5. Run tests:
```bash
pnpm test
```

## Smart Contract Architecture

### Core Contracts

1. **MUSD Token**: ERC20 implementation with EIP-2612 support
2. **Collateral Manager**: Manages Bitcoin collateral deposits via BorrowerOperations
3. **Oracle (PriceFeed)**: Price feeds for Bitcoin/USD
4. **TroveManager**: Handles liquidations and redemptions
5. **InterestRateManager**: Manages fixed interest rates on loans
6. **PCV (Protocol Controlled Value)**: Manages protocol fees and bootstrap loan

### Key Contract Interactions

The protocol consists of several interconnected contracts:

- **BorrowerOperations**: Main entry point for trove management
- **TroveManager**: Handles liquidations and redemptions
- **StabilityPool**: Provides liquidity for liquidations
- **SortedTroves**: Maintains ordered list of troves by collateralization
- **HintHelpers**: Assists with finding optimal insertion positions

## Integration Guide

### Opening a Trove Without Hints

The simplest approach, but with higher gas costs:

```typescript
import { ethers } from 'ethers';
import { ZERO_ADDRESS } from './constants';

async function openTroveSimple(
  borrowerOperations: Contract,
  wallet: Wallet,
  debtAmount: bigint,
  assetAmount: bigint
) {
  // Hints can be set to zero address for simple cases
  // Note: This will have O(n) gas complexity where n = number of troves
  const upperHint = ZERO_ADDRESS;
  const lowerHint = ZERO_ADDRESS;

  await borrowerOperations
    .connect(wallet)
    .openTrove(debtAmount, upperHint, lowerHint, {
      value: assetAmount,
    });
}
```

### Opening a Trove With Hints (Recommended)

For optimal gas efficiency, use hints to find the correct insertion position:

```typescript
async function openTroveWithHints(
  contracts: {
    borrowerOperations: Contract,
    troveManager: Contract,
    sortedTroves: Contract,
    hintHelpers: Contract
  },
  wallet: Wallet,
  debtAmount: bigint,
  assetAmount: bigint
) {
  // Compute expected total debt by adding gas compensation and fee
  const gasCompensation = await contracts.troveManager.MUSD_GAS_COMPENSATION();
  const expectedFee = 
    await contracts.borrowerOperations.getBorrowingFee(debtAmount);
  const expectedTotalDebt = debtAmount + expectedFee + gasCompensation;

  // Nominal CR is collateral * 1e20 / totalDebt
  // Note that price is not included in this calculation
  const nicr = (assetAmount * to1e18(100)) / expectedTotalDebt;

  // Get an approximate address hint from HintHelpers contract
  const numTroves = await contracts.sortedTroves.getSize();
  const numTrials = numTroves * 15n;
  const randomSeed = 42;

  const { 0: approxHint } = await contracts.hintHelpers.getApproxHint(
    nicr,
    numTrials,
    randomSeed,
  );

  // Use the approximate hint to get exact upper and lower hints
  const { 0: upperHint, 1: lowerHint } =
    await contracts.sortedTroves.findInsertPosition(
      nicr,
      approxHint,
      approxHint,
    );

  await contracts.borrowerOperations
    .connect(wallet)
    .openTrove(debtAmount, upperHint, lowerHint, {
      value: assetAmount,
    });
}
```

### Adjusting a Trove

Modify collateral and/or debt of an existing trove:

```typescript
async function adjustTrove(
  borrowerOperations: Contract,
  wallet: Wallet,
  collWithdrawal: bigint,
  debtChange: bigint,
  isDebtIncrease: boolean
) {
  const upperHint = ZERO_ADDRESS;
  const lowerHint = ZERO_ADDRESS;

  await borrowerOperations
    .connect(wallet)
    .adjustTrove(
      collWithdrawal,
      debtChange,
      isDebtIncrease,
      upperHint,
      lowerHint,
    );
}
```

**Convenience functions** are also available:
- `withdrawMUSD(amount, upperHint, lowerHint)` - Borrow more MUSD
- `repayMUSD(amount, upperHint, lowerHint)` - Repay MUSD debt
- `addColl(upperHint, lowerHint)` - Add more collateral (payable)
- `withdrawColl(amount, upperHint, lowerHint)` - Withdraw collateral

### Closing a Trove

```typescript
async function closeTrove(
  borrowerOperations: Contract,
  wallet: Wallet
) {
  // Ensure you have sufficient MUSD balance to repay debt
  // Gas compensation will be automatically refunded
  await borrowerOperations.connect(wallet).closeTrove();
}
```

### Complete Working Examples

For complete, runnable examples demonstrating all MUSD operations, see the [demo test file](https://github.com/mezo-org/musd/blob/main/test/integration/Demo.test.ts) in the repository.

## Liquidation System

### How Liquidations Work

Liquidations are performed by third-party bots that monitor trove health. When a trove falls below 110% collateralization:

1. **Bot Detection**: Liquidation bots continuously monitor trove ICRs
2. **Execution**: Any account can call `liquidate()` on an undercollateralized trove
3. **Rewards**: Liquidator receives 200 MUSD gas compensation + 0.5% of collateral
4. **Debt Settlement**: Debt is offset by Stability Pool or redistributed

```typescript
async function liquidateTrove(
  troveManager: Contract,
  wallet: Wallet,
  borrowerAddress: string
) {
  await troveManager.connect(wallet).liquidate(borrowerAddress);
}
```

### Batch Liquidations

```typescript
async function batchLiquidate(
  troveManager: Contract,
  wallet: Wallet,
  troveAddresses: string[]
) {
  await troveManager
    .connect(wallet)
    .batchLiquidateTroves(troveAddresses);
}
```

## Redemption Process

### Implementation Example

```typescript
async function redeemCollateral(
  contracts: {
    troveManager: Contract,
    priceFeed: Contract,
    hintHelpers: Contract,
    sortedTroves: Contract
  },
  wallet: Wallet,
  redemptionAmount: bigint
) {
  const maxIterations = 0;
  const price = await contracts.priceFeed.fetchPrice();

  const { firstRedemptionHint, partialRedemptionHintNICR } =
    await contracts.hintHelpers.getRedemptionHints(
      redemptionAmount,
      price,
      maxIterations,
    );

  const numTroves = await contracts.sortedTroves.getSize();
  const numTrials = numTroves * 15n;
  const { hintAddress: approxPartialRedemptionHint } =
    await contracts.hintHelpers.getApproxHint(
      partialRedemptionHintNICR,
      numTrials,
      42,
    );

  const { 0: upperPartialRedemptionHint, 1: lowerPartialRedemptionHint } =
    await contracts.sortedTroves.findInsertPosition(
      partialRedemptionHintNICR,
      approxPartialRedemptionHint,
      approxPartialRedemptionHint,
    );

  await contracts.troveManager
    .connect(wallet)
    .redeemCollateral(
      redemptionAmount,
      firstRedemptionHint,
      upperPartialRedemptionHint,
      lowerPartialRedemptionHint,
      partialRedemptionHintNICR,
      maxIterations,
    );
}
```

## Interest Rate Management

### Fixed Interest Rates

MUSD uses a simple, fixed interest rate model:

- **Global Rate**: Single rate applies to all new troves
- **Fixed on Opening**: Rate is locked when trove is opened
- **Simple Interest**: Non-compounding interest calculation
- **Refinancing**: Users can refinance to new global rate

### Refinancing a Trove

```typescript
async function refinanceTrove(
  borrowerOperations: Contract,
  wallet: Wallet
) {
  await borrowerOperations.connect(wallet).refinance();
}
```

## Testing

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test test/integration/Demo.test.ts

# Run with gas reporting
pnpm test:gas

# Run with coverage
pnpm coverage
```

## Security Considerations

### Best Practices

1. **Access Control**: Implement proper role-based permissions
2. **Reentrancy Protection**: Use checks-effects-interactions pattern
3. **Oracle Security**: Validate price feeds and implement circuit breakers
4. **Upgrade Safety**: Use proxy patterns for contract upgrades
5. **Interest Calculation**: Verify simple interest calculations
6. **Hint Validation**: Always validate hints are current

## Additional Resources

- **[MUSD Main README](https://github.com/mezo-org/musd/blob/main/README.md)** - Comprehensive architectural overview and system design
- **[Simple Interest Documentation](https://github.com/mezo-org/musd/blob/main/simpleInterest.md)** - Detailed interest calculation mechanics
- **[Demo Test Suite](https://github.com/mezo-org/musd/blob/main/test/integration/Demo.test.ts)** - Working code examples for all operations
- **[MUSD User Guide](/docs/users/musd/)** - End-user documentation
- **[Smart Contract Security](/docs/developers/security)** - Security best practices

:::note
This developer guide provides integration examples and quick reference. For comprehensive architectural details, system design, protocol mechanics, and in-depth explanations of concepts like the Protocol Bootstrap Loan, Protocol Controlled Value (PCV), and complete contract specifications, refer to the **[main MUSD README](https://github.com/mezo-org/musd/blob/main/README.md)**.
:::

## Support

For development support:
- Join the [Mezo Discord](https://discord.com/invite/mezo)
- Check the [GitHub Issues](https://github.com/mezo-org/musd/issues)
- Review the [FAQ](/docs/developers/getting-started/FAQs)
