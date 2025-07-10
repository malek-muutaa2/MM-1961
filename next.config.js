
const packageJson = require("./package.json");
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: https://sonarcloud.io https://${process.env.CUSTOMER_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com https://${process.env.CUSTOMER_BUCKET}.s3.amazonaws.com data:;
    font-src 'self';
    connect-src 'self' https://${process.env.CUSTOMER_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com https://${process.env.CUSTOMER_BUCKET}.s3.amazonaws.com;
    media-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
`;


/** @type {import('tailwindcss').Config} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // missingSuspenseWithCSRBailout: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint during build
  },
  // pageExtensions: [
  //   "page.tsx",
  //   "page.ts",
  //   // FIXME: Next.js has a bug which does not resolve not-found.page.tsx correctly
  //   // Instead, use `not-found.ts` as a workaround
  //   // "ts" is required to resolve `not-found.ts`
  //   // https://github.com/vercel/next.js/issues/65447
  //   "ts",
  // ],
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_USERNAME: process.env.DB_USERNAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  // headers: () => [
  //   {
  //     source: "/matching/:path*",
  //     headers: [
  //       {
  //         key: "Cache-Control",
  //         value: "no-store",
  //       },
  //     ],
  //   },
  //   {
  //     // Apply these headers to all routes in your application
  //     source: "/(.*)",
  //     headers: [
  //       {
  //         key: "Strict-Transport-Security",
  //         value: "max-age=31536000; includeSubDomains; preload",
  //       },
  //       {
  //         key: "Referrer-Policy",
  //         value: "no-referrer",
  //       },
  //       {
  //         key: "X-Content-Type-Options",
  //         value: "nosniff",
  //       },
  //       {
  //         key: "Content-Security-Policy",
  //         value: cspHeader.replace(/\n/g, "").trim(),
  //       },
  //       {
  //         key: "X-Frame-Options",
  //         value: "DENY",
  //       },
  //       {
  //         key: "X-XSS-Protection",
  //         value: "1; mode=block",
  //       },
  //     ],
  //   },
  // ],

}

module.exports = nextConfig;

// export default nextConfig
