// Sanity Type Definitions
// Use these types in your components for type safety

export type SanityImage = {
    _type: 'image';
    asset: {
        _ref: string;
        _type: 'reference';
    };
    alt?: string;
    caption?: string;
};

export type TopStory = {
    _id: string;
    _type: 'topStory';
    title: string;
    slug: {
        current: string;
    };
    author?: string;
    mainImage?: string; // URL after query
    excerpt?: string;
    body: any[]; // Portable Text
    publishedAt?: string;
    featured?: boolean;
    category?: string;
};

export type LocalNews = {
    _id: string;
    _type: 'localNews';
    title: string;
    image: string; // URL after query
    description?: string;
    publishedAt: string;
    order?: number;
};

export type LatestNews = {
    _id: string;
    _type: 'latestNews';
    heading: string;
    content: string;
    date: string;
    active: boolean;
};

export type HeroSection = {
    _id: string;
    _type: 'heroSection';
    greeting?: string;
    welcomeMessage?: string;
    tagline?: string;
    description?: string;
    ctaButtonText?: string;
    secondaryButtonText?: string;
};

export type Doctor = {
    _id: string;
    _type: 'doctor';
    name: string;
    specialization: string;
    photo?: string; // URL after query
    hospital?: string;
    phone?: string;
    availability?: string;
    order?: number;
    active: boolean;
};

export type Obituary = {
    _id: string;
    _type: 'obituary';
    name: string;
    photo?: string; // URL after query
    age?: number;
    place?: string;
    dateOfDeath: string;
    funeralDetails?: string;
    active: boolean;
};

export type Advertisement = {
    _id: string;
    _type: 'advertisement';
    title: string;
    position: 'ad-one' | 'ad-two' | 'banner';
    image: string; // URL after query
    link?: string;
    active: boolean;
    startDate?: string;
    endDate?: string;
};
