import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31_536_000,
    qualities: [75, 82, 90],
    imageSizes: [180, 240, 245, 384],
    localPatterns: [
      { pathname: "/api/title-image" },
      { pathname: "/characters/**" },
      { pathname: "/editorial/**" },
      { pathname: "/moments/**" },
      { pathname: "/titles/**" },
      { pathname: "/trailers/**" },
    ],
    remotePatterns: [
      { protocol: "https", hostname: "i.annihil.us" },
      { protocol: "https", hostname: "cdn.marvel.com" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "en.wikipedia.org" },
      { protocol: "https", hostname: "media.criticalhit.net" },
    ],
  },
};

export default nextConfig;
