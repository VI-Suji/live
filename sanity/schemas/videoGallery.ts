export default {
    name: 'videoGallery',
    title: 'Video Gallery',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'videoUrl',
            title: 'Video Link',
            type: 'url',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'thumbnail',
            title: 'Thumbnail Image',
            type: 'image',
            options: {
                hotspot: true,
            },
            fields: [
                {
                    name: 'alt',
                    type: 'string',
                    title: 'Alternative Text',
                },
            ],
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number',
            initialValue: 0,
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'thumbnail',
        },
    },
};
