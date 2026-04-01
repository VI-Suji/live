"use client";

import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans_Malayalam } from 'next/font/google';

const notoSansMalayalam = Noto_Sans_Malayalam({
  weight: ['400', '500', '600', '700'],
  subsets: ['malayalam'],
  variable: '--font-noto-malayalam',
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`${notoSansMalayalam.variable} font-sans`}>
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
