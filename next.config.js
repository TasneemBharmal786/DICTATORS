/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Avoid blocking production builds if eslint package is absent
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Enforce strict TypeScript validation on production builds
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
