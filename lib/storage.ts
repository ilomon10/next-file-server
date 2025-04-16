import { FileStore } from "@tus/file-store";
import { S3Store } from "@tus/s3-store";
import CONSTANTS from "./constants";
import fs from "fs";
import path from "path";
import { LocalFileSystemDriver } from "./data-store/local-file-system";
import { MinioDriver } from "./data-store/minio";

const client_local_store = new LocalFileSystemDriver();
const client_minio_store = new MinioDriver();

const tus_s3_store = new S3Store({
  s3ClientConfig: {
    bucket: CONSTANTS.MINIO_BUCKET,
    region: "id-tuminting",
    endpoint: CONSTANTS.MINIO_ENDPOINT,
    forcePathStyle: true,
    credentials: {
      accessKeyId: CONSTANTS.MINIO_ACCESS_KEY,
      secretAccessKey: CONSTANTS.MINIO_SECRET_KEY,
    },
  },
});

const tus_file_store = new FileStore({ directory: "./files" });

const tus_storage =
  CONSTANTS.STORAGE_TYPE === "local" ? tus_file_store : tus_s3_store;

const client_storage =
  CONSTANTS.STORAGE_TYPE === "local" ? client_local_store : client_minio_store;

const storage = {
  client_storage: client_local_store,
  tus_storage: tus_storage,
};

export default storage;
