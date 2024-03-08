import '@/styles/tailwind.css';
// import { FacebookProvider } from 'react-facebook';
import { AppProps } from 'next/app'
import Head from 'next/head'
import { Manrope, Dosis } from 'next/font/google'
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { FacebookProvider } from 'react-facebook';
import { ApolloClient, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import axios from 'axios';
import { getCookie } from 'cookies-next';
// import { Provider } from 'react-redux'
// import { persistor, store } from '../store/store.js';
// import { PersistGate } from 'redux-persist/integration/react';

import { SessionProvider } from "next-auth/react";
import { useSession, signIn, signOut } from 'next-auth/react';

import AppLayout from '../../layout/AppLayout'

const manrope = Manrope({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-manrope',
})

const dosis = Dosis({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dosis',
})

const token = getCookie('token')

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL

const client = new ApolloClient({
  uri: SERVER_URL,
  cache: new InMemoryCache(),
  headers: {
    ...(token !== undefined ? { Authorization: `Bearer ${token}` } : {})
  },
});

axios.defaults.baseURL = SERVER_URL;
axios.defaults.headers.common['Authorization'] = "Bearer" + token;

export default function App({  Component, pageProps: {session, ...pageProps} }: AppProps): JSX.Element {
  const router = useRouter();
  const isLoginPage = router.asPath === '/auth/login' || router.asPath === '/auth/signup';


  return (
    <>
      <Head>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Edcenta</title>
        <meta name="description" content="Best e-learning platform" />
        <meta name="keywords" content="ticket, spaces," />
      </Head>
      <ApolloProvider client={client}>
        {/* <Provider store={store}> */}
          {/* <PersistGate loading={null} persistor={persistor}> */}
            {/* <GoogleOAuthProvider clientId='1054832259017-7ud7lha28m8r3p9oa6fj6hsv0ndme7bb.apps.googleusercontent.com'>
              <FacebookProvider appId="171352182602769"> */}
                <SessionProvider session={session}>
                <main className={`${manrope.variable} ${dosis.variable} font-sans`}>
                {/* {session ? (
                  <>
                  <AppLayout>
                    <Component {...pageProps} />
                  </AppLayout>
                  </>
                ) : (
                  <>
                    <Component {...pageProps} />
                  </>
                )} */}

                  <AppLayout>
                    <Component {...pageProps} />
                  </AppLayout>
                </main>
                </SessionProvider>
              {/* </FacebookProvider>
            </GoogleOAuthProvider> */}
          {/* </PersistGate> */}
        {/* </Provider> */}
      </ApolloProvider>
    </>
  )
}

