---
title: Mezo Nodes Overview
description: >-
  Learn how Mezo Nodes operate and support network functionality for
  Bitcoin-based finance.
topic: developers
---

Mezo Nodes are essential components of the network and are fully open-source. The [Mezo Validator Kit](./validator-kit) sets up the [mezod client](https://github.com/mezo-org/mezod) and the other requirements to run a node as a validator, an RPC node, or a seed node. The kit simplifies several deployment options such as Docker, a native daemon, and Helm for Kubernetes.

- See [mezod](https://github.com/mezo-org/mezod) on GitHub.
- Use the [Validator Kit](./validator-kit) to run your own local seed node.

## Hardware requirements

Hardware requirements are different for each node type. See the [hardware requirements](./validator-kit#hardware-requirements) section to find the minimum requirements for each node type.

## Validators

Mezo Validators are responsible for running nodes that verify transactions, propose and attest new blocks, and participate in the consensus mechanism. Mezo Validators must apply for [Proof of Authority (PoA)](./validator-kit#validator-setup) before their nodes can participate as validators.

Approved validators can follow the instructions for the [Validator Kit](./validator-kit) to learn how to run a validator node.

## RPC nodes

RPC nodes can be used to create a local endpoint for development or as part of a blockchain infrastructure-as-a-service (IaaS) platform. The process for setting up a seed node is the same as a validator node, but you do not need to request Proof of Authority (PoA).

To run an RPC node, follow the instructions in the [Validator Kit](./validator-kit) setup guide, but apply the additional configuration steps defined in the [RPC node](./validator-kit#rpc-node-setup) setup section.

## Seed nodes

Seed nodes assist with network peer discovery. The process for setting up a seed node is the same as a validator node, but you do not need to request Proof of Authority (PoA).

To run a seed node, follow the instructions in the [Validator Kit](./validator-kit) setup guide, but skip the application for PoA and set the `p2p.seed_mode` parameter in the node's config.toml file to `true`. See the [Network seed nodes](https://github.com/mezo-org/validator-kit?tab=readme-ov-file#network-seed-nodes) section for details.
