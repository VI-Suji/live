import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import { getCachedData, setCachedData } from './cache';

// Original config wrapped in base
export const sanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true, // Use CDN for better performance and reduced API requests
});

// Wrapped client that caches \`.fetch()\` calls for 2 hours in-memory
const originalFetch = sanityClient.fetch.bind(sanityClient);
sanityClient.fetch = async (query: string, params: any = {}, options: any = {}) => {
    const cacheKey = JSON.stringify({ query, params });
    const cached = getCachedData(cacheKey);
    if (cached) {
        return cached;
    }
    const data = await originalFetch(query, params, options);
    setCachedData(cacheKey, data);
    return data;
};

export const adminSanityClient = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false, // Set to false if you want fresh data
    token: process.env.SANITY_API_TOKEN, // Only needed for mutations
});

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
    return builder.image(source);
}
