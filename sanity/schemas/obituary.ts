export default {
    name: 'obituary',
    title: 'Obituaries',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'photo',
            title: 'Photo',
            type: 'image',
            options: {
                hotspot: true,
            },
        },
        {
            name: 'age',
            title: 'Age',
            type: 'number',
        },
        {
            name: 'place',
            title: 'Place',
            type: 'string',
        },
        {
            name: 'dateOfDeath',
            title: 'Date of Death',
            type: 'date',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'funeralDetails',
            title: 'Funeral Details',
            type: 'text',
            rows: 3,
        },
        {
            name: 'active',
            title: 'Active',
            type: 'boolean',
            initialValue: true,
        },
    ],
    orderings: [
        {
            title: 'Date of Death, Recent',
            name: 'dateDesc',
            by: [{ field: 'dateOfDeath', direction: 'desc' }],
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'dateOfDeath',
            media: 'photo',
        },
    },
};
