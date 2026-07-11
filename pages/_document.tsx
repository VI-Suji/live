import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ml">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/gramika.png" type="image/png" />
        <link rel="apple-touch-icon" href="/gramika.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
