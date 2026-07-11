import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { Noto_Sans_Malayalam, Inter } from "next/font/google";
import LegacyShareRedirect from "@/components/LegacyShareRedirect";

const notoSansMalayalam = Noto_Sans_Malayalam({
  weight: ["400", "500", "600", "700"],
  subsets: ["malayalam"],
  variable: "--font-noto-malayalam",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`${notoSansMalayalam.variable} ${inter.variable} font-sans`}>
        <LegacyShareRedirect />
        <Component {...pageProps} />
      </div>
    </SessionProvider>
  );
}
