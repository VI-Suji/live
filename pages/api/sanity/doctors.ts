import type { NextApiRequest, NextApiResponse } from 'next';
import { sanityClient } from '../../../sanity/config';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
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

        const doctors = await sanityClient.fetch(query);

        res.status(200).json(doctors);
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({ error: 'Failed to fetch doctors' });
    }
}
