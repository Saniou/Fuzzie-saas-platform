/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
      {
        protocol: 'https',
        hostname: 'ucarecdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.ucarecdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.ucarecd.net',
      },
    ],
  },
};

export default nextConfig;
