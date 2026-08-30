import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    localPatterns: [{ pathname: "/api/title-image" }],
    remotePatterns: [
      { protocol: "https", hostname: "i.annihil.us" },
      { protocol: "https", hostname: "cdn.marvel.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "en.wikipedia.org" },
    ],
  },
};

export default nextConfig;
