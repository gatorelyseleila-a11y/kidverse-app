const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@kidverse/ui', '@kidverse/database'],
  remotePatterns: [
    {
      protocol: 'https',
      hostname: '**.amazonaws.com',
    },
    {
      protocol: 'https',
      hostname: 'kidverse.app',
    },
    {
      protocol: 'http',
      hostname: 'localhost',
    }
  ],
  env: {
    _next_intl_trailing_slash: 'false'
  },
  trailingSlash: false,
  async rewrites() {
    // En development, proxy vers le backend NestJS sur port 4000
    // En production, il sera sur le même domaine /api
    const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.API_URL || 'https://api.kidverse.app'
      : process.env.API_URL || 'http://localhost:4000';
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`,
      }
    ];
  }
};

module.exports = withNextIntl(nextConfig);

