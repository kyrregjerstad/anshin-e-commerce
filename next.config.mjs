import { withAxiom } from 'next-axiom';
import withPlugins from 'next-compose-plugins';
import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.noroff.dev',
      },
    ],
  },
  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  },
  experimental: {
    ppr: true,
  },
};

const sentryConfig = {
  silent: true,
  org: 'kyrre-gjerstad',
  project: 'anshin',
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: '/monitoring',
  hideSourceMaps: true,
  disableLogger: true,
  automaticVercelMonitors: true,
};

const nextPlugins = [
  (nextConfig) => withAxiom(nextConfig),
  (nextConfig) => withSentryConfig(nextConfig, sentryConfig),
];

export default withPlugins(nextPlugins, nextConfig);
