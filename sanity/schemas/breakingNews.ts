export default {
    name: 'breakingNews',
    title: 'Breaking News',
    type: 'document',
    fields: [
        {
            name: 'title',
            title: 'News Title',
            type: 'string',
            validation: (Rule: any) => Rule.required().max(150),
            description: 'Keep it concise for the ticker',
        },
        {
            name: 'link',
            title: 'Link URL',
            type: 'url',
            description: 'Optional link when news is clicked',
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            description: 'Show this breaking news on the website',
            initialValue: true,
        },
        {
            name: 'priority',
            title: 'Priority',
            type: 'number',
            description: 'Lower number = higher priority (1, 2, 3)',
            validation: (Rule: any) => Rule.required().min(1).max(3),
            initialValue: 1,
        },
        {
            name: 'expiryDate',
            title: 'Expiry Date',
            type: 'datetime',
            description: 'Optional: News will stop showing after this date',
        },
    ],
    orderings: [
        {
            title: 'Priority',
            name: 'priorityAsc',
            by: [
                { field: 'priority', direction: 'asc' },
                { field: '_createdAt', direction: 'desc' }
            ]
        }
    ],
    preview: {
        select: {
            title: 'title',
            active: 'active',
            priority: 'priority',
        },
        prepare(selection: any) {
            const { title, active, priority } = selection;
            return {
                title: `${active ? '✓' : '✗'} [${priority}] ${title}`,
                subtitle: active ? 'Active' : 'Inactive',
            };
        },
    },
};
