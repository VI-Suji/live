// In-memory cache for Sanity API responses
type CacheEntry = {
    data: any;
    timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours in ms

export const getCachedData = (key: string): any | null => {
    const entry = cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
    if (isExpired) {
        cache.delete(key);
        return null;
    }

    return entry.data;
};

export const setCachedData = (key: string, data: any) => {
    cache.set(key, {
        data,
        timestamp: Date.now(),
    });
};

export const clearCache = () => {
    cache.clear();
};
