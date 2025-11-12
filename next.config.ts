import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone', // Enable standalone build for pkg
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        path: require.resolve('path-browserify'),
      };
    }
    return config;
  },
  turbopack: {},
};

export default nextConfig;
