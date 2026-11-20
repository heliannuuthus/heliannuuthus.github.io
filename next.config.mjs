/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  transpilePackages: ["@heliannuuthus/npm"],
  images: {
    unoptimized: true
  },
  trailingSlash: false,
};

export default nextConfig;
