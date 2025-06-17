/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
   webpack: (config, { isServer }) => {
        config.externals.push('cloudflare:sockets'); 
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback, // Preserve existing fallbacks
        dns: false,
        net: false,
        tls: false,
        fs: false,
        child_process: false,
        // Add any other Node.js core modules that might cause issues
      };
    }
    return config;
  },

}

export default nextConfig