import React, { createContext, useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import { theme } from "../src/theme";
import { LoadingPage } from "../src/Components/Loading";
import { useShuffleCards } from "../src/use-shuffle-cards";
import { Application } from "../src/AppContext";

const App = (props) => {
  const { Component, pageProps } = props;
  const [loading, setLoading] = useState(false);
  const { state, dispatch } = useShuffleCards();

  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setLoading(true);
    };
    const handleRouteChangeEnd = () => {
      setLoading(false);
    };

    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeEnd);

    return () => {
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeEnd);
    };
  }, [router]);

  return (
    <Application.Provider value={{ state, dispatch }}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {loading ? <LoadingPage /> : <Component {...pageProps} />}
      </ThemeProvider>
    </Application.Provider>
  );
};

export default App;
