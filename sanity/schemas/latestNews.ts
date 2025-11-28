export default {
    name: 'latestNews',
    title: 'Latest News Widget',
    type: 'document',
    fields: [
        {
            name: 'heading',
            title: 'Heading',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'content',
            title: 'Content',
            type: 'text',
            rows: 3,
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'date',
            title: 'Date',
            type: 'date',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            description: 'Only one latest news should be active at a time',
            initialValue: true,
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
    ],
    preview: {
        select: {
            title: 'heading',
            subtitle: 'date',
            active: 'active',
        },
        prepare(selection: any) {
            const { title, subtitle, active } = selection;
            return {
                title: `${active ? '✓ ' : ''}${title}`,
                subtitle,
            };
        },
    },
};
