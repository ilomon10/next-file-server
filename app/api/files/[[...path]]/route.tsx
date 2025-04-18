import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { nanoid } from "nanoid";
import { hashFilename } from "@/lib/hash-filename";
import storage, { client_storage } from "@/lib/storage";
import CONSTANTS from "@/lib/constants";

type METHOD_PARAMS = { params: { path: string[] } };

export async function GET(req: NextRequest, { params }: METHOD_PARAMS) {
  let file_path_raw = params.path || [];

  file_path_raw = storage.join(...file_path_raw).split("/");
  try {
    let file_type = await checkFileType(file_path_raw);
    if (file_type === null && file_path_raw.length === 1) {
      await client_storage.mkdir(file_path_raw.join("/"), true);
      file_type = await checkFileType(file_path_raw);
    }

    if (file_type === null) {
      throw new Error(
        `File named \`${encodeURI(file_path_raw.join("/"))}\` not exist.`
      );
    }

    let files_buffer: (typeof file_type)[] = [];

    if (file_type.type === "file") {
      files_buffer = [
        {
          ...file_type,
          type: "file",
        },
      ];
    } else {
      const readdir = await client_storage.readdir(file_type.path);
      files_buffer = readdir.map((f) => {
        return {
          name: f.name,
          type: f.isDirectory ? "folder" : "file",
          path: path.posix.join(f.path, f.name),
          parentPath: f.path,
        };
      });
    }

    const filesPromise = files_buffer
      .filter((file) => {
        return [".info", ".json"].indexOf(path.extname(file.name)) === -1;
      })
      .map(async (file): Promise<FileOrFolder> => {
        const type = file.type;
        const parentPath = file.parentPath.split("/").slice(1).join("/");

        if (type === "folder") {
          return {
            type: "folder",

            id: nanoid(),
            name: file.name,
            parentPath,
          };
        }
        const raw_file = await client_storage.readFile(
          `${file.path}${
            CONSTANTS.STORAGE_TYPE === "local" ? ".json" : ".info"
          }`,
          "utf-8"
        );
        const json: JsonMeta = JSON.parse(raw_file);

        const id = json.id.split("/").pop() as string;

        return {
          type: "file",

          id: id,
          name: json.metadata.name || file.name,
          parentPath,
          size: json.size,
          mime: json.metadata.filetype,
          // meta: json,
          creation_date: json.creation_date,
        };
      });

    const files = await Promise.all(filesPromise);

    return NextResponse.json(
      { total: files.length, data: files },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json(
      { status: 500, code: err.code, message: err.message || err.code },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: METHOD_PARAMS) {
  let file_path_raw = params.path || [];
  file_path_raw = storage.join(...file_path_raw).split("/");
  if (!params.path) {
    return Response.json(
      { status: 400, message: "Bad request" },
      { status: 400 }
    );
  }

  const file_type = await checkFileType(file_path_raw);

  if (!file_type) {
    return Response.json(
      {
        status: 404,
        message: `Folder named \`${file_path_raw.join("/")}\` not exist.`,
      },
      { status: 404 }
    );
  }

  await client_storage.rm(file_type.path, true);

  return new Response(undefined, { status: 204 });
}

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

async function checkFileType(file_path_raw: string[]): Promise<{
  name: string;
  path: string;
  parentPath: string;
  type: "folder" | "file";
} | null> {
  let type: "folder" | "file" = "folder";
  const duplicate_file_path_raw = [...file_path_raw];
  let document_name = duplicate_file_path_raw.pop() as string;
  const parent_path = duplicate_file_path_raw.join("/") as string;
  let full_path = path.posix.join(parent_path, document_name);

  if (await client_storage.exists(full_path)) {
    // Directly found in the expected location
    type = (await client_storage.stat(full_path))?.isDirectory
      ? "folder"
      : "file";
  } else {
    document_name = hashFilename(document_name);
    full_path = path.posix.join(parent_path, document_name);

    if (await client_storage.exists(full_path)) {
      type = "file"; // If the hashed filename exists, it's a file
    } else {
      return null;
    }
  }
  return {
    name: document_name,
    path: full_path,
    parentPath: parent_path,
    type,
  };
}
