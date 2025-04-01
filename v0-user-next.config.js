/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure we're using the App Router
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs', 'nodemailer'],
  },
  // Increase the timeout for serverless functions
  serverRuntimeConfig: {
    maxDuration: 60, // 60 seconds
  },
}

export default nextConfig

