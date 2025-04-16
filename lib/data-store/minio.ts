import { BucketItem, Client as MinioClient, S3Error } from "minio";
import nodepath from "node:path";
import CONSTANTS from "../constants";
import { DataStoreDriver, Dirent } from "./driver";

const MINIO_URL = new URL(CONSTANTS.MINIO_ENDPOINT);

const minio_client = new MinioClient({
  endPoint: MINIO_URL.hostname,
  port: 80,
  region: "id-tuminting",
  useSSL: false,
  accessKey: CONSTANTS.MINIO_ACCESS_KEY,
  secretKey: CONSTANTS.MINIO_SECRET_KEY,
});

export class MinioDriver implements DataStoreDriver {
  constructor() {
    this.client = minio_client;
    this.bucket = CONSTANTS.MINIO_BUCKET || "/";
  }

  private bucket: string;
  private client: MinioClient;

  async mkdir(path: string) {
    await this.client.putObject(
      this.bucket,
      `${path}/.placeholder`,
      "folder_placeholder"
    );
  }

  async readdir(path: string) {
    let result: Dirent[] = [];
    const items = await this._listObjectsV2(`${path}/`);
    items.forEach((item) => {
      let _item = this._checkThisPath(item);

      result.push(
        new Dirent({
          name: _item.name,
          size: item.size,
          path: _item.path,
          isFile: _item.isFile,
          isDirectory: _item.isDirectory,
        })
      );
    });
    return result;
  }

  async readFile(path: string) {
    return await new Promise<string>(async (resolve, reject) => {
      const stream = await this.client.getObject(this.bucket, path);
      let data = "";
      stream.on("data", (chunk: Buffer) => {
        data += chunk.toString("utf-8");
      });
      stream.on("end", () => resolve(data));
      stream.on("error", reject);
    });
  }

  async writeFile(path: string, data: string) {
    await this.client.putObject(this.bucket, path, data);
  }

  async stat(path: string) {
    const items = await this._listObjectsV2(path);
    const item = items.find((item) => {
      const res = this._checkThisPath(item);
      if (res.isFile) {
        return item.name === path;
      } else {
        return item.prefix?.replace(/\/+$/, "") === path;
      }
    });

    if (!item) return undefined;

    const formattedItem = this._checkThisPath(item);

    return {
      size: item.size,
      isDirectory: formattedItem.isDirectory,
      isFile: formattedItem.isFile,
    };
  }

  async exists(path: string) {
    try {
      const item = await this.stat(path);
      // console.log(item);
      return typeof item !== "undefined";
    } catch (error: any) {
      if (["NotFound", "NoSuchKey"].indexOf(error.code) > -1) {
        return false;
      }
      throw error; // Rethrow if it's not a "NoSuchKey" error
    }
  }

  async rm(path: string, recursive?: boolean) {
    const files = await this._listObjectsV2(path, recursive);
    const file_names = files.map((file) => file.name as string);
    await this.client.removeObjects(this.bucket, file_names);
  }

  private _checkThisPath(item: BucketItem) {
    let isFile = item.size > 0;
    const path = item.prefix?.replace(/\/+$/, "").split("/") as string[];

    const result = {
      name: "",
      path: "",
      isFile,
      isDirectory: !isFile,
    };

    if (isFile) {
      result.name = item.name as string;
      result.path = item.prefix as string;
    } else {
      result.name = path[path.length - 1];
      result.path = path.slice(0, -1).join("/") + "/";
    }

    return result;
  }

  private async _listObjectsV2(path: string, recursive?: boolean) {
    let result: BucketItem[] = [];
    await new Promise((resolve, reject) => {
      const stream = this.client.listObjectsV2(this.bucket, path, recursive);
      stream.on("end", () => {
        resolve(result);
      });
      stream.on("data", (obj) => {
        result.push(obj);
      });
      stream.on("error", (err) => {
        reject(err);
      });
    });
    return result;
  }
}
