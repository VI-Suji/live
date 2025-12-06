import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const now = new Date().toISOString();

        const query = `*[_type == "breakingNews" && (active == true || !defined(active)) && 
      (!defined(startDate) || startDate <= $now) &&
      (!defined(expiryDate) || expiryDate > $now)] | order(priority asc, _createdAt desc) {
      _id,
      title,
      link,
      active,
      priority,
      startDate,
      expiryDate
    }`;

        const breakingNews = await sanityClient.fetch(query, { now });

        res.status(200).json(breakingNews);
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        res.status(500).json({ error: 'Failed to fetch breaking news' });
    }
}
