---
title: Mezo Passport Setup Guide
description: Instructions to set up Mezo Passport
topic: developers
---

[Mezo Passport](https://www.npmjs.com/package/@mezo-org/passport) is a package built on top of [RainbowKit](https://rainbowkit.com/) and provides additional wallet connection options specifically tailored for Bitcoin wallets and Mezo. With this package, developers can integrate Bitcoin wallet support alongside Ethereum-compatible (EVM) wallets to create a more versatile connection experience for users. Passport integrates with [viem](https://viem.sh/) and [wagmi](https://wagmi.sh/) libraries for streamlined wallet management across Bitcoin and EVM ecosystems.

Get the [@mezo-org/passport](https://www.npmjs.com/package/@mezo-org/passport) NPM Package

If you cannot use Mezo Passport for your dApp, the configuration steps in the [Configure your Environment](../../../../../../docs/developers/getting-started/configure-environment) guide are sufficient for traditional EVM development.

### Before you begin



* [Configure your Environment](../../../../../../docs/developers/getting-started/configure-environment) for development with HardHat or Foundry.
* If you are not familiar with RainbowKit, read the [RainbowKit documentation](https://www.rainbowkit.com/) to learn the basics.

### Install


See the [Getting Started Guide](https://mezo.org/docs/developers/getting-started) for canonical installation instructions.

### Configure your application


See the [Getting Started Guide](https://mezo.org/docs/developers/getting-started) for canonical configuration examples.

### Connecting wallets



To connect to the Mezo Passport wallet, use the standard Wagmi or RainbowKit components.

#### Wagmi



```
import { useChainId, useConnect } from "wagmi";

export const YourApp = () => {
  const chainId = useChainId();
  const { connectors, connect } = useConnect();

  return (
    <div>
      {connectors.map((connector) => (
        <button
          type="button"
          onClick={() => {
            connect({ connector, chainId });
          }}
          key={connector.id}
        >
          {connector.name}
        </button>
      ))}
    </div>
  );
};
```

#### RainbowKit



```
import { ConnectButton } from "@rainbow-me/rainbowkit"

export const YourApp = () => {
  return <ConnectButton label="Connect wallet"/>;
};
```

### Next steps



You can find additional examples in the [Mezo Passport Readme](https://www.npmjs.com/package/@mezo-org/passport#installation). An example dApp is available in the [Passport GitHub repository](https://github.com/mezo-org/passport/tree/main/example)
