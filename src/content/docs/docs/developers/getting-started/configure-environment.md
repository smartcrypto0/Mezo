---
title: Set Up Developer Environment
description: Configure your development environment to build and deploy on Mezo.
topic: developers
---

Configure your Hardhat or Foundry development environment for Mezo Testnet.

### Before you begin

Before you can deploy applications, you will need an Ethereum wallet with testnet BTC to pay for the gas fees.

* [Connect to Mezo Testnet](../../../../../../docs/users/getting-started/connect/)

### Hardhat

If you are new to Hardhat, use the [Hardhat Quick Start](https://hardhat.org/hardhat-runner/docs/getting-started#quick-start) guide to learn how to install and initialize your project.

To configure Hardhat to work with Mezo Testnet, set the following items in your Hardhat config file:

* Add an entry under `networks` for Mezo Testnet with `url: "https://rpc.test.mezo.org"` and `chainId: 31611`.
* In the `solidity` settings, add `evmVersion: "london"`.

See the [Getting Started Guide](https://mezo.org/docs/developers/getting-started) for the canonical Hardhat example.

### Foundry

If you are new to Foundry, use the [Foundry Getting Started](https://book.getfoundry.sh/getting-started/installation) guide to learn how to install and initialize your project.

To configure a Foundry project to work with Mezo Testnet, set the following items in your Foundry TOML file under `[profile.default]` or a preferred profile:

* Chain ID: `chain_id = 31611`
* RPC: `eth_rpc_url = "https://rpc.test.mezo.org"`
* EVM Version: `evm_version = 'london'`

See the [Getting Started Guide](https://mezo.org/docs/developers/getting-started) for canonical Foundry settings.
