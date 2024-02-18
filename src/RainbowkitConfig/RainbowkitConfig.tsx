import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { env_Vars } from "../config/env";
import { type Config } from "wagmi";
import { SELECTED_CHAIN, ganache, transports } from "../config/config";

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
    transports: transports,
  });
};
