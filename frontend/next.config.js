/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      optimizeCss: true,
    },
    images: {
      domains: ['images.unsplash.com', 'logos-download.com', 'picsum.photos'],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.unsplash.com',
          port: '',
          pathname: '/**',
        },
        {
          protocol: 'https',
          hostname: 'picsum.photos',
          port: '',
          pathname: '/**',
        },
      ],
      formats: ['image/avif', 'image/webp'],
    },
  }
  
  module.exports = nextConfig