import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
        return res.status(400).json({ error: 'Slug is required' });
    }

    try {
        const query = `*[_type == "topStory" && slug.current == $slug][0] {
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

        const post = await sanityClient.fetch(query, { slug });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error fetching post:', error);
        res.status(500).json({ error: 'Failed to fetch post' });
    }
}
