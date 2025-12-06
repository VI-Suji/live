import { NextStudio } from "next-sanity/studio";
import config from "../../sanity.config";
import Head from "next/head";

export default function StudioPage() {
    return (
        <>
            <Head>
                <title>Gramika News - Studio</title>
                <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
                <style>{`
          html, body, #__next {
            height: 100%;
            margin: 0;
            overflow: hidden;
          }
        `}</style>
            </Head>
            <NextStudio config={config} />
        </>
    );
}
