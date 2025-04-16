/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  env: {
    site_url: process.env.SITE_URL,
    app_name: process.env.APP_NAME,
    storage_type: process.env.STORAGE_TYPE,
    minio_bucket: process.env.MINIO_BUCKET,
    minio_access_key: process.env.MINIO_ACCESS_KEY,
    minio_secret_key: process.env.MINIO_SECRET_KEY,
    minio_endpoint: process.env.MINIO_ENDPOINT,
  },
};

export default nextConfig;
