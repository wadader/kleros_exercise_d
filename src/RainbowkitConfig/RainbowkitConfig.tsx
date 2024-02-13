import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia } from "viem/chains";
import { env_Vars } from "../config/env";
import {  http } from "wagmi";

const SELECTED_CHAIN = sepolia
const transports = {
  [SELECTED_CHAIN.id]: http(env_Vars.INFURA_ENDPOINT),
} as const;

export const wagmiProviderConfig = getDefaultConfig({
  appName: "Rock Paper Scissors Lizard Spock",
  projectId: env_Vars.WALLET_CONNECT_PROJECT_ID,
  chains: [SELECTED_CHAIN],
  transports,
});