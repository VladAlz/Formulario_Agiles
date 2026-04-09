/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/clientes/:path*',
        destination: 'http://localhost:5296/api/clientes/:path*',
      },
      {
        source: '/api/productos/:path*',
        destination: 'http://localhost:5277/api/productos/:path*',
      },
      {
        source: '/api/ventas/:path*',
        destination: 'http://localhost:5100/api/ventas/:path*',
      },
    ];
  },
};

export default nextConfig;