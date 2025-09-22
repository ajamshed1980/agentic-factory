import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuration for development server
  ...(process.env.NODE_ENV === 'development' && {
    // Allow iframe embedding for Replit proxy
    async headers() {
      return [
        {
          source: '/(.*)',
          headers: [
            {
              key: 'X-Frame-Options',
              value: 'ALLOWALL',
            },
          ],
        },
      ];
    },
  }),
};

export default nextConfig;
