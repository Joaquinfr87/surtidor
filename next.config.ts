import type { NextConfig } from "next"
import withSerwistInit from "@serwist/next"

const nextConfig: NextConfig = {
  /* config options here */
}

// Serwist is only applied in production builds (uses webpack, incompatible with Turbopack)
export default process.env.NODE_ENV === "production"
  ? withSerwistInit({
      swSrc: "app/sw.ts",
      swDest: "public/sw.js",
      reloadOnOnline: true,
    })(nextConfig)
  : nextConfig
