/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true
  },
  trailingSlash: false,
  transpilePackages: ["next-mdx-remote"]
};

export default nextConfig;
