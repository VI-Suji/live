import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { all } = req.query;
    const filter = all === 'true' ? '' : ' && active == true';
    const limit = all === 'true' ? '' : ' [0...2]';

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

        if (!latestNewsList || latestNewsList.length === 0) {
            return res.status(404).json({ error: 'No active latest news found' });
        }

        // Auto-disable latest news if date has passed
        const todayStr = new Date().toISOString().split('T')[0];
        const itemsToDeactivate = latestNewsList.filter((n: any) => n.active && n.date < todayStr);
        
        if (itemsToDeactivate.length > 0) {
            Promise.all(
                itemsToDeactivate.map((item: any) => 
                    sanityClient.patch(item._id).set({ active: false }).commit()
                )
            ).catch(err => console.error("Failed to auto-deactivate expired latest news:", err));
            
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
