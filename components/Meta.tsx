import Head from 'next/head';

interface MetaProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
}

const Meta = ({
    title = "Gramika - ഗ്രാമിക | ഗ്രാമീണതയുടെ ഹൃദയതാളം",
    description = "ഏറ്റവും പുതിയ പ്രാദേശിക വാർത്തകൾ, വിശേഷങ്ങൾ, അറിയിപ്പുകൾ എന്നിവ അറിയാൻ ഗ്രാമിക സന്ദർശിക്കുക. Truthful news and updates at your fingertips.",
    keywords = "Gramika, Gramika Web, Gramika News, Gramika TV, News Gramika, ഗ്രാമിക, Malayalam News, Kerala News, Local News, Breaking News, Live News, Kuthuparamba News",
    image = "https://www.gramika.in/gramika.png",
    url = "https://www.gramika.in"
}: MetaProps) => {
    return (
        <Head>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="robots" content="index, follow" />
            <meta name="language" content="Malayalam" />

            {/* Canonical */}
            <link rel="canonical" href={url} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Gramika" />
            <meta property="og:locale" content="ml_IN" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Favicon */}
            <link rel="icon" href="/favicon.ico" />

            {/* Search Engine Verification (Optional - add codes later) */}
            {/* <meta name="google-site-verification" content="YOUR_CODE" /> */}
        </Head>
    );
};

export default Meta;
