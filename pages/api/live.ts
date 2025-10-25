import type { NextApiRequest, NextApiResponse } from "next";

/**
 * Server-side proxy that determines whether a channel has an active live stream
 * by requesting /channel/{id}/live and inspecting the final URL after redirects.
 *
 * Returns:
 *  { live: boolean, videoId?: string | null, checkedAt: number }
 *
 * No API key required. Adds short caching to reduce repeat hits.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const channelId = Array.isArray(req.query.channelId) ? req.query.channelId[0] : req.query.channelId;
    if (!channelId) {
        return res.status(400).json({ error: "channelId required" });
    }

    const target = `https://www.youtube.com/channel/${encodeURIComponent(channelId)}/live`;

    try {
        // Follow redirects server-side and inspect final url.
        const resp = await fetch(target, {
            redirect: "follow",
            headers: { "User-Agent": "Mozilla/5.0 (compatible)" },
        });

        const finalUrl = resp.url || "";
        let videoId: string | null = null;
        let live = false;

        try {
            if (finalUrl.includes("/watch")) {
                const u = new URL(finalUrl);
                videoId = u.searchParams.get("v");
                if (videoId) live = true;
            } else if (finalUrl.includes("/shorts/")) {
                // not a live stream, but handle if needed
                live = false;
                videoId = null;
            } else {
                // Sometimes the redirect may not point to /watch; fall back to HTML sniffing
                const text = await resp.text();
                const match = text.match(/"videoId":"([a-zA-Z0-9_-]{11})"/);
                if (match) {
                    videoId = match[1];
                    // check for live badge in page
                    live = /"liveBroadcastContent":"live"/.test(text) || /"isLive":true/.test(text);
                }
            }
        } catch {
            videoId = null;
            live = false;
        }

        // Short server-side cache so clients don't overload YouTube
        res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
        return res.status(200).json({ live, videoId: live ? videoId : null, checkedAt: Date.now() });
    } catch (err) {
        console.error("API /api/live error:", err);
        return res.status(500).json({ live: false, videoId: null, checkedAt: Date.now() });
    }
}