import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests for Replit development
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: [
      'localhost',
      '127.0.0.1',
      // Allow all Replit domains
      '*.replit.dev',
    ],
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
