// In-memory cache for Sanity API responses
type CacheEntry = {
    data: any;
    timestamp: number;
};

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 2 * 60 * 60 * 1000; // 2 hours in ms

// Track the moment a manual sync happened 
// We use this to briefly bypass the Sanity CDN (~60s) to guarantee "instant" sync
let lastSyncTimestamp = 0;
const SYNC_BYPASS_WINDOW = 60 * 1000; // 60 seconds

export const setCacheHeaders = (res: any) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
};

export const getCachedData = (key: string): any | null => {
    const entry = cache.get(key);
    if (!entry) return null;

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
    
    const parts = formatter.format(new Date()).split(':');
    let currentHour = parseInt(parts[0], 10);
    if (currentHour === 24) currentHour = 0;
    const currentMinute = parseInt(parts[1], 10);

    const isMorningQuiet = currentHour < 9;
    const isEveningQuiet = currentHour > 21 || (currentHour === 21 && currentMinute >= 30);
    const isQuietHours = isMorningQuiet || isEveningQuiet;

    if (!isQuietHours) {
        const isExpired = Date.now() - entry.timestamp > CACHE_TTL;
        if (isExpired) {
            cache.delete(key);
            return null;
        }
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
    console.log('🧹 Clearing Sanity cache (Map size was: ' + cache.size + ')');
    cache.clear();
    lastSyncTimestamp = Date.now();
};

export const isRecentlySynced = (): boolean => {
    const diff = Date.now() - lastSyncTimestamp;
    const isRecent = diff < SYNC_BYPASS_WINDOW;
    
    if (lastSyncTimestamp === 0) {
        // console.log('[SYNC] No manual sync recorded since server start.');
    } else if (isRecent) {
        console.log(`[SYNC] Recent sync detected (${(diff/1000).toFixed(1)}s ago). Bypassing CDN.`);
    } else {
        // console.log(`[SYNC] Last sync was ${(diff/1000).toFixed(1)}s ago. Using CDN.`);
    }
    
    return isRecent;
};
