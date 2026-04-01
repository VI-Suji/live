import Head from 'next/head';

interface MetaProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
}

const Meta = ({
    title = "Gramika News - ഗ്രാമിക | ഗ്രാമീണതയുടെ ഹൃദയതാളം",
    description = "ഏറ്റവും പുതിയ പ്രാദേശിക വാർത്തകൾ, വിശേഷങ്ങൾ, അറിയിപ്പുകൾ എന്നിവ അറിയാൻ ഗ്രാമിക സന്ദർശിക്കുക. Truthful news and updates at your fingertips.",
    keywords = "Gramika, Gramika Web, Gramika News, Gramika TV, News Gramika, ഗ്രാമിക, Malayalam News, Kerala News, Local News, Breaking News, Live News, Kuthuparamba News",
    image = "https://www.gramika.in/gramika.png",
    url = "https://www.gramika.in",
    type = "website"
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
            <meta property="og:type" content={type} />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content="Gramika News" />
            <meta property="og:locale" content="ml_IN" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />

            {/* Favicon */}
            <link rel="icon" href="/gramika.png" type="image/png" />
            <link rel="apple-touch-icon" href="/gramika.png" />

            <link rel="manifest" href="/manifest.json" />

            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            "@context": "https://schema.org",
                            "@type": "WebSite",
                            "@id": "https://www.gramika.in/#website",
                            "name": "Gramika News",
                            "alternateName": ["Gramika", "ഗ്രാമിക", "Gramika News"],
                            "url": "https://www.gramika.in"
                        },
                        {
                            "@context": "https://schema.org",
                            "@type": "NewsMediaOrganization",
                            "@id": "https://www.gramika.in/#organization",
                            "name": "Gramika News",
                            "alternateName": ["Gramika", "ഗ്രാമിക", "Gramika TV", "Gramika Web"],
                            "url": "https://www.gramika.in",
                            "logo": {
                              "@type": "ImageObject",
                              "@id": "https://www.gramika.in/gramika.png",
                              "url": "https://www.gramika.in/gramika.png",
                              "width": 600,
                              "height": 600
                            },
                            "sameAs": [
                                "https://www.facebook.com/GRAMIKATV/",
                                "https://www.instagram.com/gramikatv/",
                                "https://www.youtube.com/@GramikaTv"
                            ],
                            "description": description,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": "Kuthuparamba",
                                "addressRegion": "Kerala",
                                "addressCountry": "IN"
                            },
                            "contactPoint": {
                                "@type": "ContactPoint",
                                "telephone": "04902360808",
                                "contactType": "newsroom",
                                "email": "newsgramika@gmail.com"
                            },
                            "publishingPrinciples": "https://www.gramika.in/about"
                        }
                    ])
                }}
            />
        </Head>
    );
};

export default Meta;
