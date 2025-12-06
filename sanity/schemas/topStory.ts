export default {
    name: 'topStory',
    title: 'Top Stories',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'slug',
            title: 'Slug',
            type: 'slug',
            options: {
                source: 'title',
                maxLength: 96,
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'author',
            title: 'Author',
            type: 'string',
            initialValue: 'Gramika Team',
        },
        {
            name: 'mainImage',
            title: 'Main Image',
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
        },
        {
            name: 'excerpt',
            title: 'Excerpt',
            type: 'text',
            rows: 3,
        },
        {
            name: 'body',
            title: 'Body',
            type: 'array',
            of: [
                {
                    type: 'block',
                },
                {
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
                        {
                            name: 'caption',
                            type: 'string',
                            title: 'Caption',
                        },
                    ],
                },

            ],
        },
        {
            name: 'publishedAt',
            title: 'Published At',
            type: 'datetime',
            initialValue: () => new Date().toISOString(),
        },
        {
            name: 'featured',
            title: 'Featured',
            type: 'boolean',
            initialValue: false,
        },
        {
            name: 'category',
            title: 'Category',
            type: 'string',
            options: {
                list: [
                    { title: 'News', value: 'news' },
                    { title: 'Politics', value: 'politics' },
                    { title: 'Sports', value: 'sports' },
                    { title: 'Entertainment', value: 'entertainment' },
                    { title: 'Local', value: 'local' },
                ],
            },
        },
    ],
    preview: {
        select: {
            title: 'title',
            author: 'author',
            media: 'mainImage',
        },
    },
};
