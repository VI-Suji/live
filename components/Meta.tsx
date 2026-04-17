import Head from 'next/head';

interface MetaProps {
    title?: string;
    description?: string;
    keywords?: string;
    image?: string;
    url?: string;
    type?: 'website' | 'article';
    articleData?: {
        publishedTime?: string;
        modifiedTime?: string;
        author?: string;
        section?: string;
        tags?: string[];
    };
}

const Meta = ({
    title = "Gramika News - ഗ്രാമിക | ഗ്രാമീണതയുടെ ഹൃദയതാളം",
    description = "ഏറ്റവും പുതിയ പ്രാദേശിക വാർത്തകൾ, വിശേഷങ്ങൾ, അറിയിപ്പുകൾ എന്നിവ അറിയാൻ ഗ്രാമിക സന്ദർശിക്കുക. Truthful news and updates at your fingertips.",
    keywords = "Gramika, Gramika Web, Gramika News, Gramika TV, News Gramika, ഗ്രാമിക, Malayalam News, Kerala News, Local News, Breaking News, Live News, Kuthuparamba News",
    image = "https://www.gramika.in/gramika.png",
    url = "https://www.gramika.in",
    type = "website",
    articleData
}: MetaProps) => {
    return (
        <Head>
            {/* Essential Meta Tags for WhatsApp & Social Media */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:image:secure_url" content={image} />
            <meta property="og:image:type" content="image/png" />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:url" content={url} />
            <meta property="og:type" content={type} />
            <meta property="og:site_name" content="Gramika News" />

            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
            <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
            <meta name="language" content="Malayalam" />

            {type === 'article' && articleData?.publishedTime && (
                <meta property="article:published_time" content={articleData.publishedTime} />
            )}
            {type === 'article' && articleData?.author && (
                <meta property="article:author" content={articleData.author} />
            )}
            {type === 'article' && articleData?.section && (
                <meta property="article:section" content={articleData.section} />
            )}
            {type === 'article' && articleData?.tags && articleData.tags.map(tag => (
                <meta key={tag} property="article:tag" content={tag} />
            ))}

            {/* Canonical */}
            <link rel="canonical" href={url} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={url} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

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
                        },
                        ...(type === 'article' ? [{
                            "@context": "https://schema.org",
                            "@type": "NewsArticle",
                            "mainEntityOfPage": {
                                "@type": "WebPage",
                                "@id": url
                            },
                            "headline": title,
                            "description": description,
                            "image": [image],
                            "datePublished": articleData?.publishedTime,
                            "dateModified": articleData?.modifiedTime || articleData?.publishedTime,
                            "author": {
                                "@type": "Person",
                                "name": articleData?.author || "Gramika Team",
                                "url": "https://www.gramika.in"
                            },
                            "publisher": {
                                "@type": "Organization",
                                "name": "Gramika News",
                                "logo": {
                                    "@type": "ImageObject",
                                    "url": "https://www.gramika.in/gramika.png"
                                }
                            }
                        }] : []),
                        {
                            "@context": "https://schema.org",
                            "@type": "BreadcrumbList",
                            "itemListElement": [
                                {
                                    "@type": "ListItem",
                                    "position": 1,
                                    "name": "Home",
                                    "item": "https://www.gramika.in"
                                },
                                ...(type === 'article' ? [
                                    {
                                        "@type": "ListItem",
                                        "position": 2,
                                        "name": articleData?.section || "News",
                                        "item": `https://www.gramika.in/news/${articleData?.section?.toLowerCase() || 'general'}`
                                    },
                                    {
                                        "@type": "ListItem",
                                        "position": 3,
                                        "name": title,
                                        "item": url
                                    }
                                ] : [])
                            ]
                        }
                    ])
                }}
            />
        </Head>
    );
};

export default Meta;
