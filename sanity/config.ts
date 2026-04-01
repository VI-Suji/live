import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

import { getCachedData, setCachedData, isRecentlySynced } from './cache';

// Base credentials
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = '2024-01-01';

// Public CDN Client (Standard)
export const sanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: true,
});

// Public Live Client (Bypasses CDN, NO token for safety)
const livePublicClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
});

// Admin Client (For mutations - has token)
export const adminSanityClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

// Capture safe fetch methods
const cdnFetch = sanityClient.fetch.bind(sanityClient);
const liveFetch = livePublicClient.fetch.bind(livePublicClient);

// Wrap public client's fetch with caching
sanityClient.fetch = async (query: string, params: any = {}, options: any = {}) => {
    // 1. Unique key including query and params (NO timestamp here to allow 2-hr sharing)
    const cacheKey = JSON.stringify({ query, params });
    
    // 2. Check local in-memory cache
    const cached = getCachedData(cacheKey);
    if (cached) {
        // console.log('✅ [CACHE HIT]');
        return cached;
    }

    // 3. Fallback to API. 
    // If 'Sync Now' was pressed within the last 60s, we bypass the Sanity CDN globally (freshness).
    // Otherwise, we use the Sanity CDN to save regular API quota.
    const mustBypassCDN = isRecentlySynced();
    if (mustBypassCDN) {
        console.log(`⚠️  [CDN BYPASS] Manual Sync Active - Fetching fresh data from Sanity Live API...`);
    } else {
        console.log(`📡 [FETCHING] Requesting from Sanity CDN Edge...`);
    }
    
    const fetcher = mustBypassCDN ? liveFetch : cdnFetch;
    const data = await fetcher(query, params, options);
    
    // 4. Save to cache
    setCachedData(cacheKey, data);
    return data;
};

// Image URL builder
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
    return builder.image(source);
}
