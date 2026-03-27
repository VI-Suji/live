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

    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
    
    const parts = formatter.format(new Date()).split(':');
    // handle "24" edge case from some Node implementations
    let currentHour = parseInt(parts[0], 10);
    if (currentHour === 24) currentHour = 0;
    const currentMinute = parseInt(parts[1], 10);

    // Quiet hours are 9:30 PM (21:30) to 9:00 AM (09:00) IST
    const isMorningQuiet = currentHour < 9; // 00:00 to 08:59
    const isEveningQuiet = currentHour > 21 || (currentHour === 21 && currentMinute >= 30); // 21:30 to 23:59
    
    const isQuietHours = isMorningQuiet || isEveningQuiet;

    // Skip automatic expiration during quiet hours
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
    cache.clear();
};
