/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Skip static optimization for auth-related pages
  // They will be server-rendered instead
}

module.exports = nextConfig

