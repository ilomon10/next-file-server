import { BucketItem, Client as MinioClient, S3Error } from "minio";
import CONSTANTS from "../constants";
import { DataStoreDriver, Dirent } from "./driver";

const MINIO_URL = new URL(CONSTANTS.MINIO_ENDPOINT);
export class MinioDriver implements DataStoreDriver {
  constructor() {
    this.client = new MinioClient({
      endPoint: MINIO_URL.hostname,
      port: 80,
      region: "id-tuminting",
      useSSL: false,
      accessKey: CONSTANTS.MINIO_ACCESS_KEY,
      secretKey: CONSTANTS.MINIO_SECRET_KEY,
    });
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
    const result: Dirent[] = [];
    const items = await this._listObjectsV2(`${path}/`);
    items
      .filter((item) => {
        if (!item.name) return true;
        return (item.name as string).indexOf(".placeholder") < 0;
      })
      .forEach((item) => {
        const _item = this._checkThisPath(item);
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

  readFile(path: string): Promise<Buffer>;
  readFile(path: string, encoding: BufferEncoding): Promise<string>;

  async readFile(path: string, encoding: BufferEncoding | null = null) {
    return await new Promise<Buffer | string>(async (resolve, reject) => {
      const stream = await this.client.getObject(this.bucket, path);
      const data: Buffer[] = [];
      stream.on("data", (chunk: Buffer) => {
        data.push(chunk);
      });
      stream.on("end", () => {
        const buffer = Buffer.concat(data);
        if (encoding) {
          resolve(buffer.toString(encoding));
        } else {
          resolve(buffer);
        }
      });
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
      return typeof item !== "undefined";
    } catch (error: unknown) {
      const errorCode: string =
        error instanceof S3Error ? (error.code as string) : "Unknown error";
      if (["NotFound", "NoSuchKey"].indexOf(errorCode) > -1) {
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
    const isFile = item.size > 0;
    const name = item.name?.split("/") as string[];
    const path = item.prefix?.replace(/\/+$/, "").split("/") as string[];

    const result = {
      name: "",
      path: "",
      isFile,
      isDirectory: !isFile,
    };

    if (isFile) {
      result.name = name[name.length - 1];
      result.path = name.slice(0, -1).join("/") + "/";
    } else {
      result.name = path[path.length - 1];
      result.path = path.slice(0, -1).join("/") + "/";
    }

    return result;
  }

  private async _listObjectsV2(path: string, recursive?: boolean) {
    const result: BucketItem[] = [];
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
