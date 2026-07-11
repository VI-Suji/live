"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Opens legacy hash URLs on the homepage modal instead of navigating away.
 * e.g. /#news/slug → stay on home, push /news/slug and open popup
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
                window.history.replaceState(null, "", `/news/${slug}`);
                window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
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
                        window.history.replaceState(null, "", data.path);
                        window.dispatchEvent(new PopStateEvent("popstate", { state: null }));
                    }
                })
                .catch(() => {});
        }
    }, [router.asPath]);

    return null;
}
