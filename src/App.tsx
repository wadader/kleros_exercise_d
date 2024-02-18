import { WagmiProvider, http } from "wagmi";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  darkTheme,
  getDefaultConfig,
} from "@rainbow-me/rainbowkit";

import { ThemeProvider } from "./ThemeProvider";
import { createdRouter } from "./routes/routes";

import useSiweAuth, {
  authenticationAdapter,
} from "./Rainbowkit/RainbowKitAuth";
import { env_Vars } from "./config/env";
import { Notifications } from "@mantine/notifications";
import { SELECTED_CHAIN } from "./config/config";

const queryClient = new QueryClient();

export default function App() {
  const { authenticationStatus } = useSiweAuth();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={authenticationStatus}
        >
          <RainbowKitProvider theme={darkTheme()}>
            <ThemeProvider>
              <Notifications />
              <RouterProvider router={createdRouter} />
            </ThemeProvider>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

const transports = {
  [SELECTED_CHAIN.id]: http(env_Vars.INFURA_ENDPOINT),
} as const;

const config = getDefaultConfig({
  appName: "Rock Paper Scissors Lizard Spock",
  projectId: env_Vars.WALLET_CONNECT_PROJECT_ID,
  chains: [SELECTED_CHAIN],
  transports: transports,
});
