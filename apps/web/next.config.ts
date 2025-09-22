import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow cross-origin requests for Replit development
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: [
      'localhost',
      '127.0.0.1',
      // Allow all Replit domains (simplified pattern)
      '4404f7fd-4700-4ce9-b755-656e5b0e8262-00-1oltauv8jyvxp.riker.replit.dev',
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
