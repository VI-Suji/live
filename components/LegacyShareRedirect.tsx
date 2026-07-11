"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Redirects legacy shared URLs (hash-based) to the dedicated article pages.
 * Old links like https://www.gramika.in/#news/slug opened the homepage modal.
 */
export default function LegacyShareRedirect() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window === "undefined") return;

        const { pathname, hash } = window.location;
        const onHome = pathname === "/" || pathname === "";

        if (!onHome || !hash) return;

        if (hash.startsWith("#news/")) {
            const slug = decodeURIComponent(hash.slice("#news/".length)).replace(/^\/+/, "");
            if (slug) {
                window.location.replace(`/news/${encodeURIComponent(slug)}`);
            }
            return;
        }

        const idMatch = hash.match(/^#news-([a-zA-Z0-9-]+)$/);
        if (idMatch) {
            const id = idMatch[1];
            fetch(`/api/sanity/resolveNews?id=${encodeURIComponent(id)}`)
                .then((res) => (res.ok ? res.json() : null))
                .then((data) => {
                    if (data?.path) {
                        window.location.replace(data.path);
                    }
                })
                .catch(() => {});
        }
    }, [router.asPath]);

    return null;
}
