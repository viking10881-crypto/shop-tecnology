// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
  },
};

module.exports = nextConfig;
