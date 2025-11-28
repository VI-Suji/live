
import { createClient } from '@sanity/client';

const client = createClient({
    projectId: '71188896', // I need to find the project ID from sanity/config.ts or env
    dataset: 'production',
    useCdn: false,
    apiVersion: '2023-01-01',
    token: 'skF6Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7Q7' // I don't have the token here.
});

// Wait, I should use the existing sanity client config.
