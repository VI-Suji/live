/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow all domains (not recommended for production, safer to list only needed ones)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
