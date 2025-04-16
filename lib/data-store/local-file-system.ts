import fs from "node:fs";
import nodepath from "node:path";
import { DataStoreDriver, Dirent } from "./driver";

export class LocalFileSystemDriver implements DataStoreDriver {
  constructor() {
    // Initialize the driver if needed
  }

  async mkdir(path: string) {
    fs.mkdirSync(path, { recursive: true });
  }

  async readdir(path: string) {
    return fs.readdirSync(path, { withFileTypes: true }).map((dirent) => {
      return new Dirent({
        name: dirent.name,
        size: dirent.isFile() ? fs.statSync(`${path}/${dirent.name}`).size : 0,
        path: path,
        isFile: dirent.isFile(),
        isDirectory: dirent.isDirectory(),
      });
    });
  }

  async readFile(path: string) {
    return fs.readFileSync(path, "utf-8");
  }

  async writeFile(filepath: string, data: string) {
    const dir = nodepath.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return fs.writeFileSync(filepath, data, {
      encoding: "utf-8",
      mode: 0o666,
    });
  }

  async stat(path: string) {
    let stat;
    try {
      stat = fs.statSync(path);
    } catch (err) {
      return undefined;
    }
    return {
      size: stat.size,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile(),
    };
  }

  async exists(path: string) {
    return fs.existsSync(path);
  }

  async rm(path: string, recursive: boolean = false) {
    fs.rmSync(path, { recursive: recursive || false, force: true });
  }
}
