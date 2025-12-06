export default {
    name: 'doctor',
    title: 'Doctors Available',
    type: 'document',
    fields: [
        {
            name: 'name',
            title: 'Doctor Name',
            type: 'string',
            validation: (Rule: any) => Rule.required(),
        },
        {
            name: 'specialization',
            title: 'Specialization',
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
            name: 'hospital',
            title: 'Hospital/Clinic',
            type: 'string',
        },
        {
            name: 'phone',
            title: 'Phone Number',
            type: 'string',
        },
        {
            name: 'availability',
            title: 'Availability',
            type: 'string',
            description: 'e.g., "Mon-Fri 9AM-5PM"',
        },
        {
            name: 'order',
            title: 'Display Order',
            type: 'number',
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
            title: 'Display Order',
            name: 'orderAsc',
            by: [{ field: 'order', direction: 'asc' }],
        },
    ],
    preview: {
        select: {
            title: 'name',
            subtitle: 'specialization',
            media: 'photo',
        },
    },
};
