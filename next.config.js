// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
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
