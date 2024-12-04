import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_DEFAULT_MODEL: process.env.NEXT_PUBLIC_DEFAULT_MODEL,
    OLLAMA_ENDPOINT: process.env.OLLAMA_ENDPOINT,
  },
};

export default nextConfig;
