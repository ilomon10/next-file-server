/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    site_url: process.env.SITE_URL,
    app_name: process.env.APP_NAME,
  },
};

export default nextConfig;
