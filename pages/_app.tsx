import type { AppProps } from "next/app";
import dynamic from "next/dynamic";
import React from "react";

import ".styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  const AccountProvider = dynamic(() => import(".components/AccountContext"), {
    ssr: false,
  });

  return (
    <AccountProvider>
      <main className="flex min-h-screen items-center justify-center">
        <Component {...pageProps} />
      </main>
    </AccountProvider>
  );
}
