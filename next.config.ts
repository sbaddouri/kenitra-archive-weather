import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  staticPageGenerationTimeout: 300,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;