// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/favicon.svg',
        permanent: false,
      },
    ];
  },
  /*images: {
    domains: [
      'image.shutterstock.com',
      "localhost",                 // <- backend de Django
      "marketplace.canva.com",
      "creamossas.com",
      "img.freepik.com",
      "s3-eu-west-3.amazonaws.com",
      "brydenapparel.com",
      "res.cloudinary.com",
    ],
  },*/
};

module.exports = nextConfig;
