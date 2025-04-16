import fs from "node:fs";

export interface DataStoreDriver {
  mkdir: (path: string) => Promise<void>;
  readdir: (path: string) => Promise<Dirent[]>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, data: string) => Promise<void>;
  exists: (path: string) => Promise<boolean>;
  stat: (path: string) => Promise<ItemStat | undefined>;
  rm: (path: string, recursive?: boolean) => Promise<void>;
}

export interface DirentType {
  name: string;
  size: number;
  path: string;

  isDirectory: boolean;
  isFile: boolean;
}

export interface ItemStat {
  size: number;

  isDirectory: boolean;
  isFile: boolean;
}

export class Dirent implements DirentType {
  name: string;
  size: number;
  path: string;
  isDirectory: boolean;
  isFile: boolean;

  constructor({
    name,
    size,
    path,

    isFile,
    isDirectory,
  }: {
    name: string;
    size: number;
    path: string;

    isFile?: boolean;
    isDirectory?: boolean;
  }) {
    this.name = name;
    this.size = size;
    this.path = path;
    this.isDirectory = isDirectory || false;
    this.isFile = isFile || false;
  }
}
