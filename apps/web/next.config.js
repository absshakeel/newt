/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@gtour/ui', '@gtour/utils'],
  images: {
    // Photography is supplied by the API/user content, so remote hosts are
    // allow-listed here rather than hard-coding asset URLs at build time.
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
    NEXT_PUBLIC_ADMIN_URL: process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'
  }
};

module.exports = nextConfig;