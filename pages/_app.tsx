import React, { useEffect, useState } from "react";
import Head from "next/head";
import { SessionProvider } from "next-auth/react";

import { AppProvider } from "../src/AppState";
import { AppWrapper } from "../src/Pages/AppWrapper";

const App = (props) => {
  const { Component, pageProps } = props;
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <title>jp-flashcards</title>
      </Head>
      <SessionProvider session={pageProps.session} refetchInterval={60}>
        <AppProvider>
          {ready && (
            <AppWrapper>
              <Component {...pageProps} />
            </AppWrapper>
          )}
        </AppProvider>
      </SessionProvider>
    </>
  );
};

export default App;
