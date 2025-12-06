import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const query = `*[_type == "localNews"] | order(order asc, publishedAt desc) {
      _id,
      title,
      "image": image.asset->url,
      description,
      publishedAt,
      order
    }`;

        const localNews = await sanityClient.fetch(query);

        res.status(200).json(localNews);
    } catch (error) {
        console.error('Error fetching local news:', error);
        res.status(500).json({ error: 'Failed to fetch local news' });
    }
}
