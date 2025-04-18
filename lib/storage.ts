import { FileStore } from "@tus/file-store";
import { S3Store } from "@tus/s3-store";
import CONSTANTS from "./constants";
import nodepath from "node:path/posix";
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

const tus_file_store = new FileStore({
  directory: "./",
});

export const tus_storage =
  CONSTANTS.STORAGE_TYPE === "local" ? tus_file_store : tus_s3_store;

export const client_storage =
  CONSTANTS.STORAGE_TYPE === "local" ? client_local_store : client_minio_store;
// export const client_storage = client_local_store;

const storage = {
  client_storage: client_storage,
  tus_storage: tus_storage,

  directory: CONSTANTS.STORAGE_DIRECTORY,

  join(...paths: string[]) {
    return nodepath.join(this.directory, ...paths);
  },
};

export default storage;
