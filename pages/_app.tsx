import { SWRConfig } from "swr";
import type { AppProps } from "next/app";
import { CssBaseline, ThemeProvider } from "@mui/material";

import "../styles/globals.css";
import { lightTheme } from "../themes";
import { UiProvider, CartProvider } from "../context";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <CartProvider>
        <UiProvider>
          <ThemeProvider theme={lightTheme}>
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        </UiProvider>
      </CartProvider>
    </SWRConfig>
  );
}

export default MyApp;
