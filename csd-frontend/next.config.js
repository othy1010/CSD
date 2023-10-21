/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,

  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // delay before reloading
    };
    return config;
  },
};

module.exports = nextConfig;
