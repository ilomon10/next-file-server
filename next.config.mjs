/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: "standalone",
  env: {
    SITE_URL: process.env.SITE_URL,
    APP_NAME: process.env.APP_NAME,
    STORAGE_TYPE: process.env.STORAGE_TYPE,
    STORAGE_DIRECTORY: process.env.STORAGE_DIRECTORY,
    MINIO_BUCKET: process.env.MINIO_BUCKET,
    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    DEBUG_LEVEL: process.env.DEBUG_LEVEL,
  },
};

export default nextConfig;
