import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { raw } = req.query;

    try {
        // Site-facing query: just return the URL strings
        // Admin-facing query (raw=true): return the full image structure with resolved URL for preview
        const query = `*[_type == "aboutUs"][0] {
            description,
            md {
                name,
                designation,
                area,
                phone,
                "image": select(
                    "${raw}" == "true" => {
                        "asset": image.asset,
                        "url": image.asset->url,
                        "_type": "image"
                    },
                    image.asset->url
                )
            },
            executiveDirectors[] {
                name,
                designation,
                area,
                phone,
                "image": select(
                    "${raw}" == "true" => {
                        "asset": image.asset,
                        "url": image.asset->url,
                        "_type": "image"
                    },
                    image.asset->url
                )
            },
            directors[] {
                name,
                designation,
                area,
                phone,
                "image": select(
                    "${raw}" == "true" => {
                        "asset": image.asset,
                        "url": image.asset->url,
                        "_type": "image"
                    },
                    image.asset->url
                )
            }
        }`;

        const aboutData = await sanityClient.fetch(query);

        if (!aboutData) {
            return res.status(404).json({ error: 'About Us data not found' });
        }

        res.status(200).json(aboutData);
    } catch (error) {
        console.error('Error fetching About Us data:', error);
        res.status(500).json({ error: 'Failed to fetch About Us data' });
    }
}
