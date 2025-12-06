import { defineType } from 'sanity';

export default defineType({
    name: 'siteSettings',
    title: 'Site Settings',
    type: 'document',
    fields: [
        {
            name: 'liveStreamVisible',
            title: 'Show Live Stream Section',
            type: 'boolean',
            description: 'Toggle to show/hide the live stream section on the homepage',
            initialValue: true
        },
        {
            name: 'heroSectionVisible',
            title: 'Show Hero Section',
            type: 'boolean',
            description: 'Toggle to show/hide the hero section on the homepage',
            initialValue: true
        },
        {
            name: 'advertisementsVisible',
            title: 'Show Advertisements',
            type: 'boolean',
            description: 'Toggle to show/hide all advertisements on the site',
            initialValue: true
        },
        {
            name: 'latestNewsVisible',
            title: 'Show Latest News Widget',
            type: 'boolean',
            description: 'Toggle to show/hide the latest news widget',
            initialValue: true
        },
        {
            name: 'topStoriesVisible',
            title: 'Show Top Stories Section',
            type: 'boolean',
            description: 'Toggle to show/hide the top stories section',
            initialValue: true
        },
        {
            name: 'headerImages',
            title: 'Header Rotating Images',
            type: 'array',
            of: [{ type: 'image' }],
            options: {
                layout: 'grid'
            },
            description: 'Add up to 3 images to rotate in the header. If no images are added, the Gramika logo will be shown constant.',
            validation: (Rule: any) => Rule.max(3)
        },
        {
            name: 'rotationInterval',
            title: 'Image Rotation Interval (seconds)',
            type: 'number',
            description: 'Time in seconds between image rotations. Default is 20 seconds.',
            initialValue: 20
        }
    ]
});
