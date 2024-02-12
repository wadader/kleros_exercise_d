import { MantineProvider, createTheme } from "@mantine/core";

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
