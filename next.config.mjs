/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '5x7qhhm9.us-east.insforge.app',
      },
    ],
  },
  transpilePackages: ['mapbox-gl'],
}

export default nextConfig
