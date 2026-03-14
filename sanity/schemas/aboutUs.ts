export default {
    name: 'aboutUs',
    title: 'About Us',
    type: 'document',
    fields: [
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
