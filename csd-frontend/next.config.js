/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    'swagger-ui-react',
    'swagger-client',
    'react-syntax-highlighter',    
  ],
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*',
      },
      {
        source: '/api-docs/:path*',
        destination: 'http://localhost:8080/v3/api-docs/:path*',
      },
    ]
  },
}

module.exports = nextConfig;
