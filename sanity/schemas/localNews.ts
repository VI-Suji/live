export default {
    name: 'localNews',
    title: 'Local News',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Image',
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
            name: 'description',
            title: 'Description',
            type: 'text',
            rows: 4,
        },
        {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number',
            description: 'Lower numbers appear first',
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            description: 'Show/hide this news item on the website',
            initialValue: true,
        },
    ],
    orderings: [
        {
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
        {
            title: 'Published Date, New',
            name: 'publishedAtDesc',
            by: [{ field: 'publishedAt', direction: 'desc' }],
        },
    ],
    preview: {
        select: {
            title: 'title',
            media: 'image',
            order: 'order',
        },
        prepare(selection: any) {
            const { title, media, order } = selection;
            return {
                title: `${order ? `${order}. ` : ''}${title}`,
                media,
            };
        },
    },
};
