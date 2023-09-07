/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "picsum.photos",
      "loremflickr.com",
      "placeimg.com",
      "source.unsplash.com",
    ],
  },
};

module.exports = nextConfig;
