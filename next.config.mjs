/** @type {import('next').NextConfig} */
const nextConfig = {
  serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  remotePatterns: [],
};

export default nextConfig;