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
        // Check if this is an admin request (includes all doctors) or frontend (only active)
        const showAll = req.query.all === 'true';

        const query = showAll
            ? `*[_type == "doctor"] | order(order asc) {
                _id,
                name,
                specialization,
                hospital,
                phone,
                availability,
                order,
                active
              }`
            : `*[_type == "doctor" && active == true] | order(order asc) {
                _id,
                name,
                specialization,
                hospital,
                phone,
                availability,
                order
              }`;

        const doctorsList = await sanityClient.fetch(query);

        res.status(200).json(doctorsList);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
}
