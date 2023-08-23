import remarkGfm from "remark-gfm";
import remarkEmoji from "remark-emoji";

import createMDX from "@next/mdx";

const withMDX = createMDX({
    extension: /\.mdx?$/,
    options: {
        // If you use remark-gfm, you'll need to use next.config.mjs
        // as the package is ESM only
        // https://github.com/remarkjs/remark-gfm#install
        remarkPlugins: [remarkGfm, remarkEmoji],
        rehypePlugins: [],
        // If you use `MDXProvider`, uncomment the following line.
        // providerImportSource: "@mdx-js/react",
    },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    transpilePackages: ['@luftschloss/validation', '@luftschloss/common'],
    images: {
        unoptimized: true,
    },
};

export default withMDX(nextConfig);
