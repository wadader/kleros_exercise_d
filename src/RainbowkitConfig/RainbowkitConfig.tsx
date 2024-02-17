import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "viem/chains";
import { env_Vars } from "../config/env";
import { type Config, http } from "wagmi";
import { defineChain } from "viem";

const ganache = defineChain({
  id: 1337,
  name: "Ganache",
  nativeCurrency: {
    decimals: 18,
    name: "Ganache Ether",
    symbol: "GETH",
  },
  rpcUrls: {
    default: {
      http: ["http://127.0.0.1:7545"],
    },
  },
});

const SELECTED_CHAIN = sepolia;

const transports = {
  [SELECTED_CHAIN.id]: http(env_Vars.INFURA_ENDPOINT),
} as const;

const mode = import.meta.env.MODE;

export const getWagmiProviderConfig = (): Config => {
  if (mode === "development")
    return getDefaultConfig({
      appName: "Rock Paper Scissors Lizard Spock",
      projectId: env_Vars.WALLET_CONNECT_PROJECT_ID,
      chains: [ganache],
    });

  return getDefaultConfig({
    appName: "Rock Paper Scissors Lizard Spock",
    projectId: env_Vars.WALLET_CONNECT_PROJECT_ID,
    chains: [SELECTED_CHAIN],
    transports,
  });
};
