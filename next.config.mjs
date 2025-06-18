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

  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
  // Assurer que les variables d'environnement sont disponibles
  publicRuntimeConfig: {
    // Variables publiques si nécessaire
  },
  serverRuntimeConfig: {
    // Variables serveur privées
  },

}

export default nextConfig