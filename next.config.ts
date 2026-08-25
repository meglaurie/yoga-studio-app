import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'export', // Tells Next.js to output static HTML files
  images: {
  unoptimized: true, // GitHub Pages doesn't support Next.js image optimization
  },
  // If your site URL is username.github.io/repo-name, uncomment the lines below:
  basePath: '/yoga-studio-app',
  assetPrefix: '/yoga-studio-app',

};

export default nextConfig;
