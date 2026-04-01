import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';
import { setCacheHeaders } from '../../../sanity/cache';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // Prevent browser caching so Sync Now works instantly for users (by consulting the server cache)
    setCacheHeaders(res);

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

        const breakingNewsList = await sanityClient.fetch(query, { now });

        res.status(200).json(breakingNewsList);
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        res.status(500).json({ error: 'Failed to fetch breaking news' });
    }
}
