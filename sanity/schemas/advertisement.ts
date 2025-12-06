export default {
    name: 'advertisement',
    title: 'Advertisements',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'Title',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'position',
            title: 'Position',
            type: 'string',
            options: {
                list: [
                    { title: 'Ad One (Sidebar Top)', value: 'ad-one' },
                    { title: 'Ad Two (Sidebar Middle)', value: 'ad-two' },
                    { title: 'Banner', value: 'banner' },
                ],
            },
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'image',
            title: 'Image',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'video',
            title: 'Video',
            type: 'file',
            options: {
                accept: 'video/*',
            },
        },
        {
            name: 'link',
            title: 'Link URL',
            type: 'url',
            description: 'Optional link when ad is clicked',
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
        },
        {
            name: 'startDate',
            title: 'Start Date',
            type: 'date',
        },
        {
            name: 'endDate',
            title: 'End Date',
            type: 'date',
        },
    ],
    preview: {
        select: {
            title: 'title',
            subtitle: 'position',
            media: 'image',
            active: 'active',
        },
        prepare(selection: any) {
            const { title, subtitle, media, active } = selection;
            return {
                title: `${active ? '✓ ' : '✗ '}${title}`,
                subtitle,
                media,
            };
        },
    },
};
