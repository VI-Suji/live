import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { position } = req.query;

    if (!position || typeof position !== 'string') {
        return res.status(400).json({ error: 'Position is required' });
    }

    try {
        const today = new Date().toISOString().split('T')[0];
        console.log('Fetching advertisement for position:', position, 'on date:', today);

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
        console.log('Advertisement found:', ad ? ad.title : 'None');

        if (!ad) {
            return res.status(404).json({ error: 'No active advertisement found for this position' });
        }

        res.status(200).json(ad);
    } catch (error) {
        console.error('Error fetching advertisement:', error);
        res.status(500).json({ error: 'Failed to fetch advertisement' });
    }
}
