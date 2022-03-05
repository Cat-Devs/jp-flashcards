import { SessionProvider } from 'next-auth/react';
import App from 'next/app';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import CookieConsent from 'react-cookie-consent';
import { AppProvider } from '../src/AppState';
import { AppWrapper } from '../src/Pages/AppWrapper';
const { VERCEL_GIT_COMMIT_SHA } = process.env;

const JPFlashCardApp = (props) => {
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
      <SessionProvider session={pageProps.session} refetchInterval={600}>
        <AppProvider>
          {ready && (
            <AppWrapper version={pageProps.version}>
              <Component {...pageProps} />
            </AppWrapper>
          )}
        </AppProvider>
      </SessionProvider>
      <CookieConsent location="bottom" cookieName="cookie-consent" expires={999}>
        This website uses cookies to enhance the user experience.
      </CookieConsent>
    </>
  );
};

JPFlashCardApp.getInitialProps = async (appContext) => {
  const version = VERCEL_GIT_COMMIT_SHA && VERCEL_GIT_COMMIT_SHA.split('').splice(0, 7).join('');
  const appProps = await App.getInitialProps(appContext);

  return { ...appProps, pageProps: { ...appProps.pageProps, version: version || 'dev' } };
};

export default JPFlashCardApp;
