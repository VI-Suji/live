export default {
    name: 'heroSection',
    title: 'Hero Section',
    type: 'document',
    fields: [
        {
            name: 'greeting',
            title: 'Greeting Text',
            type: 'string',
            initialValue: 'GRAMIKA NEWS ONLINE',
        },
        {
            name: 'tagline',
            title: 'Tagline',
            type: 'string',
        },
    ],
    preview: {
        select: {
            title: 'greeting',
            subtitle: 'tagline',
        },
    },
};
