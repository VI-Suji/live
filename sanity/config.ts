import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true, // Set to false if you want fresh data
    token: process.env.SANITY_API_TOKEN, // Only needed for mutations
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
    return builder.image(source);
}
