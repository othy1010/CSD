/** @type {import('next').NextConfig} */
const nextConfig = {}

// module.exports = nextConfig
module.exports = {
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://8080-othy1010-csd-kb3s9ye71lr.ws-eu101.gitpod.io/v3/api-docs/:path*',
          },
        ]
      },
  };