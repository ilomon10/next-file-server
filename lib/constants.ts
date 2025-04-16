export const SITE_URL = process.env.site_url as string;
export const APP_NAME = process.env.app_name as string;
export const STORAGE_TYPE = process.env.storage_type as "local" | "minio";
export const MINIO_BUCKET = process.env.minio_bucket as string;
export const MINIO_ACCESS_KEY = process.env.minio_access_key as string;
export const MINIO_SECRET_KEY = process.env.minio_secret_key as string;
export const MINIO_ENDPOINT = process.env.minio_endpoint as string;

const CONSTANTS = {
  SITE_URL,
  APP_NAME,
  STORAGE_TYPE,
  MINIO_BUCKET,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_ENDPOINT,
};

export default CONSTANTS;
