import { WagmiProvider } from "wagmi";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  RainbowKitAuthenticationProvider,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";

import { ThemeProvider } from "./ThemeProvider";
import { createdRouter } from "./routes/routes";
import { getWagmiProviderConfig } from "./RainbowkitConfig/RainbowkitConfig";
import useSiweAuth from "./RainbowkitConfig/RainbowKitAuth";

const queryClient = new QueryClient();

export default function App() {
  const { authenticationStatus, authenticationAdapter } = useSiweAuth();

  return (
    <WagmiProvider config={getWagmiProviderConfig()}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitAuthenticationProvider
          adapter={authenticationAdapter}
          status={authenticationStatus}
        >
          <RainbowKitProvider theme={darkTheme()}>
            <ThemeProvider>
              <RouterProvider router={createdRouter} />
            </ThemeProvider>
          </RainbowKitProvider>
        </RainbowKitAuthenticationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
