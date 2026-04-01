import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { all } = req.query;
    const filter = all === 'true' ? '' : ' && active == true';
    const limit = all === 'true' ? '' : ' [0...2]';

    // Prevent browser caching so Sync Now works instantly for users (by Consulting the server cache)
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    try {
        const query = `*[_type == "latestNews"${filter}] | order(date desc)${limit} {
            _id,
            heading,
            content,
            date,
            active,
            "image": image.asset->url
        }`;

        const latestNewsList = await sanityClient.fetch(query);
        console.log(`[DIAGNOSTIC] Query: ${query.length > 50 ? query.substring(0, 50) + '...' : query}`);
        console.log(`[DIAGNOSTIC] Items Found: ${latestNewsList ? latestNewsList.length : 0}`);
        
        if (latestNewsList && latestNewsList.length > 0) {
            console.log(`[DIAGNOSTIC] First Item Heading: ${latestNewsList[0].heading}`);
            console.log(`[DIAGNOSTIC] First Item Active: ${latestNewsList[0].active}`);
            console.log(`[DIAGNOSTIC] First Item Date: ${latestNewsList[0].date}`);
        }

        if (!latestNewsList || latestNewsList.length === 0) {
            return res.status(404).json({ error: 'No active latest news found' });
        }

        // Auto-disable latest news if date has passed
        const todayStr = new Date().toISOString().split('T')[0];
        const itemsToDeactivate = latestNewsList.filter((n: any) => n.active && n.date < todayStr);
        
        if (itemsToDeactivate.length > 0) {
            // We no longer attempt to mutate the DB here to avoid API quota limits.
            // Items are just disabled for the client response.
            itemsToDeactivate.forEach((item: any) => {
                item.active = false;
            });
        }
        
        // Final filter in case we deactivated something that shouldn't be publicly visible
        const finalNewsList = all === 'true' 
            ? latestNewsList 
            : latestNewsList.filter((n: any) => n.active);

        res.status(200).json(finalNewsList);
    } catch (error) {
        console.error('Error fetching latest news:', error);
        res.status(500).json({ error: 'Failed to fetch latest news' });
    }
}
