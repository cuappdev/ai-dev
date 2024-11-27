import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone"
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
  },
}

export default nextConfig;
