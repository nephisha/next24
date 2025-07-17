/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
      optimizeCss: true,
    },
    images: {
      domains: ['images.unsplash.com', 'logos-download.com'],
      formats: ['image/avif', 'image/webp'],
    },
  }
  
  module.exports = nextConfig