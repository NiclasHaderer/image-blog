import nextMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';
import remarkEmoji from 'remark-emoji';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import bundleAnalyzer from '@next/bundle-analyzer';

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    // If you use remark-gfm, you'll need to use next.config.mjs
    // as the package is ESM only
    // https://github.com/remarkjs/remark-gfm#install
    remarkPlugins: [remarkGfm, remarkEmoji],
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings]
    // If you use `MDXProvider`, uncomment the following line.
    // providerImportSource: "@mdx-js/react",
  }
});

const withBundleAnalyzer = bundleAnalyzer({ enabled: process.env.ANALYZE === 'true' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  transpilePackages: ['@luftschloss/validation', '@luftschloss/common'],
  images: {
    unoptimized: true
  }
};

export default withBundleAnalyzer(withMDX(nextConfig));
