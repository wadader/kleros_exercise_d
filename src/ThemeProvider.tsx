import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@rainbow-me/rainbowkit/styles.css";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const theme = createTheme({
  /** Your theme override here */
});

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      {children}
    </MantineProvider>
  );
}
