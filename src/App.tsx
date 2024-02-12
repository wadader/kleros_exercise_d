import { WagmiProvider } from "wagmi";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";

import { ThemeProvider } from "./ThemeProvider";
import { createdRouter } from "./routes/routes";
import { config } from "./RainbowkitConfig/RainbowkitConfig";

import "@mantine/core/styles.css";

const queryClient = new QueryClient();

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <ThemeProvider>
            <RouterProvider router={createdRouter} />
          </ThemeProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
