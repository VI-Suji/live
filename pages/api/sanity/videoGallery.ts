import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const showAll = req.query.all === 'true';

        const query = showAll
            ? `*[_type == "videoGallery"] | order(order asc) {
                _id,
                title,
                videoUrl,
                "thumbnail": thumbnail.asset->url,
                order,
                active
              }`
            : `*[_type == "videoGallery" && active == true] | order(order asc) {
                _id,
                title,
                videoUrl,
                "thumbnail": thumbnail.asset->url,
                order,
                active
              }`;

        const videos = await sanityClient.fetch(query);

        res.status(200).json(videos);
    } catch (error) {
        console.error('Error fetching videos:', error);
        res.status(500).json({ error: 'Failed to fetch videos' });
    }
}
