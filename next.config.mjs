/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  transpilePackages: ["@luftschloss/validation", "@luftschloss/common"],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
