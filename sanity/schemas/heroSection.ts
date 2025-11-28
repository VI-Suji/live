export default {
    name: 'heroSection',
    title: 'Hero Section',
    type: 'document',
    fields: [
        {
            name: 'greeting',
            title: 'Greeting Text',
            type: 'string',
            initialValue: 'നമസ്കാരം,',
        },
        {
            name: 'welcomeMessage',
            title: 'Welcome Message',
            type: 'text',
            rows: 3,
        },
        {
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
        },
        {
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 3,
        },
        {
            name: 'ctaButtonText',
            title: 'CTA Button Text',
            type: 'string',
            initialValue: 'Start Reading',
        },
    ],
    preview: {
        select: {
            title: 'greeting',
            subtitle: 'tagline',
        },
    },
};
