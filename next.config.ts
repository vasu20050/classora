import type { NextConfig } from "next";



const nextConfig: NextConfig = {
  // Enable experimental server actions (already default in Next 14+)
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "192.168.0.122:3000"],
    },
  },
  allowedDevOrigins: ["192.168.0.122"],

  // Allow images from Cloudinary and UI avatar services
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "api.dicebear.com" },
    ],
  },

  // Turbopack configuration
  turbopack: {},
};

export default nextConfig;
