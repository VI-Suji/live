import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        // Check if this is an admin request (includes all obituaries) or frontend (only active)
        const showAll = req.query.all === 'true';

        const query = showAll
            ? `*[_type == "obituary"] | order(dateOfDeath desc) {
                _id,
                name,
                "photo": photo.asset->url,
                age,
                place,
                dateOfDeath,
                funeralDetails,
                active
              }`
            : `*[_type == "obituary" && active == true] | order(dateOfDeath desc) {
                _id,
                name,
                "photo": photo.asset->url,
                age,
                place,
                dateOfDeath,
                funeralDetails
              }`;

        const obituaries = await sanityClient.fetch(query);

        res.status(200).json(obituaries);
    } catch (error) {
        console.error('Error fetching obituaries:', error);
        res.status(500).json({ error: 'Failed to fetch obituaries' });
    }
}
