import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // This is required for Swagger UI to work correctly
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      net: false,
      tls: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      os: false,
      child_process: false,
      worker_threads: false,
      dns: false,
      events: false,
      querystring: false,
      url: false,
      assert: false,
    };
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, '.'),
    };

    if (!isServer) {
      config.externals = [...(config.externals || []), '@google-cloud/pubsub'];
    }

    return config;
  },

  experimental: {
    serverComponentsExternalPackages: ['@google-cloud/pubsub'],
  },
};

export default nextConfig;
