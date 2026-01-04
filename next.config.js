/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug',
        destination: '/article/:year/:month/:day/:slug',
        permanent: true,
      },
      {
        source: '/:year(\\d{4})/:month(\\d{2})/:day(\\d{2})/:slug/',
        destination: '/article/:year/:month/:day/:slug',
        permanent: true,
      },
      {
        source: '/rss2.xml',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/atom.xml',
        destination: '/rss.xml',
        permanent: true,
      },
      {
        source: '/feed',
        destination: '/rss.xml',
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/aida-public/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com', 
        port: '',
      },
    ],
  },
};

export default nextConfig;
