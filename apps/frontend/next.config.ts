import type { NextConfig } from "next";
import { copyFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

const nextConfig: NextConfig = {
  // Next.js 15 configuration
  experimental: {
    // Enable modern features
    typedRoutes: true,
  },
  // Reduce preload warnings
  compiler: {
    removeConsole: false, // Temporarily disabled for debugging
  },
  // Copy Font Awesome files to public directory
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Copy Font Awesome CSS and fonts to public directory during build
      const fontAwesomePath = join(process.cwd(), 'node_modules/@fortawesome/fontawesome-free');
      const publicPath = join(process.cwd(), 'public/fontawesome');
      
      if (existsSync(fontAwesomePath)) {
        try {
          // Ensure public/fontawesome directory exists
          if (!existsSync(publicPath)) {
            mkdirSync(publicPath, { recursive: true });
          }
          
          // Copy CSS file
          copyFileSync(
            join(fontAwesomePath, 'css/all.min.css'),
            join(publicPath, 'all.min.css')
          );
          
          // Copy webfonts directory
          const webfontsSource = join(fontAwesomePath, 'webfonts');
          const webfontsDest = join(publicPath, 'webfonts');
          
          if (existsSync(webfontsSource)) {
            if (!existsSync(webfontsDest)) {
              mkdirSync(webfontsDest, { recursive: true });
            }
            
            // Copy all font files
            const { readdirSync } = require('fs');
            const files = readdirSync(webfontsSource);
            files.forEach((file: string) => {
              copyFileSync(
                join(webfontsSource, file),
                join(webfontsDest, file)
              );
            });
          }
        } catch (error) {
          console.warn('Failed to copy Font Awesome files:', error);
        }
      }
    }
    return config;
  },
};

export default nextConfig;
