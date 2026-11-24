import type { NextConfig } from "next";

const configuredBackendUrl = process.env.BACKEND_URL?.trim();

if (process.env.VERCEL === "1" && !configuredBackendUrl) {
  throw new Error("BACKEND_URL must be set in the Vercel frontend project before deploying.");
}

const backendUrl = (configuredBackendUrl || "http://127.0.0.1:8000").replace(/\/+$/, "");

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
  },
  async redirects() {
    return [
      { source: "/cabinet", destination: "/a-propos", permanent: true },
      { source: "/expertises", destination: "/prestations", permanent: true },
      { source: "/approche", destination: "/methode", permanent: true },
    ];
  },
  async rewrites() {
    return [{ source: "/api/:path*", destination: `${backendUrl}/api/:path*` }];
  },
};

export default nextConfig;
