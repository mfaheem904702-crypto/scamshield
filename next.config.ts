import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // TypeScript errors ko build ke waqt ignore karne ke liye
    ignoreBuildErrors: true,
  },
  eslint: {
    // ESLint errors ko bhi ignore karne ke liye
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;