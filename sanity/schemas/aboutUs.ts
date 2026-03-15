export default {
    name: 'aboutUs',
    title: 'About Us',
    type: 'document',
    fields: [
        {
            name: 'description',
            title: 'Page Description',
            type: 'text',
            rows: 3,
            description: 'The subtitle text displayed in the header of the About Us page.'
        },
        {
            name: 'md',
            title: 'Managing Director',
            type: 'object',
            fields: [
                { name: 'name', title: 'Name', type: 'string' },
                { name: 'designation', title: 'Designation', type: 'string' },
                { name: 'area', title: 'Area', type: 'string' },
                { name: 'phone', title: 'Phone', type: 'string' },
                { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
            ]
        },
        {
            name: 'executiveDirectors',
            title: 'Executive Directors',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'name', title: 'Name', type: 'string' },
                    { name: 'designation', title: 'Designation', type: 'string' },
                    { name: 'area', title: 'Area', type: 'string' },
                    { name: 'phone', title: 'Phone', type: 'string' },
                    { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
                ]
            }]
        },
        {
            name: 'directors',
            title: 'Directors',
            type: 'array',
            of: [{
                type: 'object',
                fields: [
                    { name: 'name', title: 'Name', type: 'string' },
                    { name: 'designation', title: 'Designation', type: 'string' },
                    { name: 'area', title: 'Area', type: 'string' },
                    { name: 'phone', title: 'Phone', type: 'string' },
                    { name: 'image', title: 'Photo', type: 'image', options: { hotspot: true } },
                ]
            }]
        }
    ]
}
