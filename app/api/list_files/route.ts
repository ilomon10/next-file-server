import CONSTANTS from "@/lib/constants";
import { client_storage } from "@/lib/storage";
import { nanoid } from "nanoid";
import { NextRequest } from "next/server";
import path from "path";

type JsonMeta = {
  id: string;
  size: number;
  offset: 0;
  metadata: {
    relativePath: string;
    name: string;
    type: string;
    filetype: string;
    filename: string;
  };
  creation_date: string;
};

export type FileOrFolder =
  | {
      type: "folder";

      id: string;
      name: string;
      parentPath: string;
    }
  | {
      type: "file";

      id: string;
      name: string;
      parentPath: string;
      size: number;
      meta?: JsonMeta;
      mime: string;
      creation_date: string;
    };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const folder = searchParams.get("folder");
  let filesSync = await client_storage.readdir(`files/${folder}`);
  let filesPromise = filesSync
    .filter((file) => {
      return [".info", ".json"].indexOf(path.extname(file.name)) === -1;
    })
    .map(async (file): Promise<FileOrFolder> => {
      const type = file.isDirectory ? "folder" : "file";
      const parentPath = file.path.split("/").slice(1).join("/");

      if (type === "folder") {
        return {
          type: "folder",

          id: nanoid(),
          name: file.name,
          parentPath,
        };
      }

      const raw_file = await client_storage.readFile(
        `${file.path}/${file.name}${
          CONSTANTS.STORAGE_TYPE === "local" ? ".json" : ".info"
        }`
      );

      const json: JsonMeta = JSON.parse(raw_file);
      const id = json.id.split("/").pop() as string;

      return {
        type: "file",

        id: id,
        name: json.metadata.name || file.name,
        parentPath: parentPath,
        size: json.size,
        mime: json.metadata.filetype,
        // meta: json,
        creation_date: json.creation_date,
      };
    });

  const files = await Promise.all(filesPromise);

  return Response.json({ total: files.length, data: files }, { status: 200 });
}
