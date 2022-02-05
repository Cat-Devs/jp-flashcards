import React, { useEffect, useState } from "react";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { theme } from "../src/theme";
import { AppProvider } from "../src/AppState";
import { useRouter } from "next/router";

const App = (props) => {
  const { Component, pageProps } = props;
  const [ready, setReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    console.warn("app provider ready");

    const handleRouteChangeStart = () => {
      console.warn("handleRouteChangeStart");
    };
    const handleRouteChangeEnd = () => {
      console.warn("handleRouteChangeEnd");
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
    };
  }, [router]);

  useEffect(() => {
    console.warn("app ready");
    setReady(true);
  }, []);

  console.warn("app");

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>jp-flashcards</title>
      </Head>
      <AppProvider>
        {ready && (
          <ThemeProvider theme={theme}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <Component {...pageProps} />
          </ThemeProvider>
        )}
      </AppProvider>
    </>
  );
};

export default App;
