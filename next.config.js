/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      { protocol: "http", hostname: "localhost", port: "3000", pathname: "**" },
      { protocol: "https", hostname: "**" }
    ]
  },
  experimental: {
    serverActions: { bodySizeLimit: "2mb" }
  }
};

module.exports = nextConfig;
