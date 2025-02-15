import fs from "fs";
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
  const files = fs
    .readdirSync(`files/${folder}`, { withFileTypes: true })
    .filter((file) => {
      return path.extname(file.name) !== ".json";
    })
    .map((file): FileOrFolder => {
      const type = file.isDirectory() ? "folder" : "file";
      const parentPath = file.parentPath.split("/").slice(1).join("/");

      if (type === "folder") {
        return {
          type: "folder",

          id: nanoid(),
          name: file.name,
          parentPath,
        };
      }

      const json: JsonMeta = JSON.parse(
        fs.readFileSync(`${file.parentPath}/${file.name}.json`, "utf8")
      );
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

  return Response.json({ total: files.length, data: files }, { status: 200 });
}
