export const SITE_URL = process.env.SITE_URL as string;
export const APP_NAME = process.env.APP_NAME as string;
export const STORAGE_TYPE = process.env.STORAGE_TYPE as "local" | "minio";
export const STORAGE_DIRECTORY = process.env.STORAGE_DIRECTORY as string;
export const MINIO_BUCKET = process.env.MINIO_BUCKET as string;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY as string;
export const MINIO_SECRET_KEY = process.env.MINIO_SECRET_KEY as string;
export const MINIO_ENDPOINT = process.env.MINIO_ENDPOINT as string;

export const SITE_PROTO = SITE_URL.startsWith("https") ? "https" : "http";

const CONSTANTS = {
  SITE_URL,
  APP_NAME,
  STORAGE_TYPE,
  STORAGE_DIRECTORY,
  MINIO_BUCKET,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_ENDPOINT,

  SITE_PROTO,
};

export default CONSTANTS;
