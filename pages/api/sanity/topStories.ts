import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const query = `*[_type == "topStory"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      author,
      "mainImage": mainImage.asset->url,
      excerpt,
      body,
      publishedAt,
      featured,
      category
    }`;

        const posts = await sanityClient.fetch(query);

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching top stories:', error);
        res.status(500).json({ error: 'Failed to fetch top stories' });
    }
}
