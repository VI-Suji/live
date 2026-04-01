import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';
import { setCacheHeaders } from '../../../sanity/cache';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Prevent browser caching so Sync Now works instantly for users (by consulting the server cache)
    setCacheHeaders(res);

    const { position } = req.query;

    if (!position || typeof position !== 'string') {
        return res.status(400).json({ error: 'Position is required' });
    }

    try {
        const today = new Date().toISOString().split('T')[0];

        const query = `*[_type == "advertisement" && position == $position && (active == true || !defined(active)) && 
      (!defined(startDate) || startDate <= $today) && 
      (!defined(endDate) || endDate >= $today)][0] {
      _id,
      title,
      position,
      "image": image.asset->url,
      "video": video.asset->url,
      link,
      active,
      startDate,
      endDate
    }`;

        const ad = await sanityClient.fetch(query, { position, today });

        if (!ad) {
            return res.status(404).json({ error: 'No active advertisement found for this position' });
        }

        res.status(200).json(ad);
    } catch (error) {
        console.error('Error fetching advertisement:', error);
        res.status(500).json({ error: 'Failed to fetch advertisement' });
    }
}
