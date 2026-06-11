import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverComponentsExternalPackages: ["@prisma/client", "bcryptjs"],
  remotePatterns: [],
};

export default nextConfig;
