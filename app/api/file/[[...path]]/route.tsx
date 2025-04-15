import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { hashFilename } from "@/lib/hash-filename";

type METHOD_PARAMS = { params: { path: string[] } };

export async function GET(req: NextRequest, { params }: METHOD_PARAMS) {
  let file_path_raw = params.path || [];
  file_path_raw = ["files", ...file_path_raw];

  try {
    let file_type = checkFileType(file_path_raw);

    if (file_type === null && file_path_raw.length === 1) {
      fs.mkdirSync(file_path_raw.join("/"), { recursive: true });
      file_type = checkFileType(file_path_raw);
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
      files_buffer = fs
        .readdirSync(file_type.path, { withFileTypes: true })
        .map((f) => ({
          name: f.name,
          type: f.isDirectory() ? "folder" : "file",
          path: path.join(f.parentPath, f.name),
          parentPath: f.parentPath,
        }));
    }

    const files = files_buffer
      .filter((file) => {
        return path.extname(file.name) !== ".json";
      })
      .map((file): FileOrFolder => {
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

        const json: JsonMeta = JSON.parse(
          fs.readFileSync(`${file.path}.json`, "utf8")
        );

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

    return NextResponse.json(
      { total: files.length, data: files },
      { status: 200 }
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // console.log(err);
    return NextResponse.json(
      { status: 500, message: err.code || err.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: METHOD_PARAMS) {
  let file_path_raw = params.path || [];
  file_path_raw = ["files", ...file_path_raw];

  if (!params.path) {
    return Response.json(
      { status: 400, message: "Bad request" },
      { status: 400 }
    );
  }

  const file_type = checkFileType(file_path_raw);

  if (!file_type) {
    return Response.json(
      {
        status: 404,
        message: `Folder named \`${file_path_raw.join("/")}\` not exist.`,
      },
      { status: 404 }
    );
  }

  fs.rmSync(file_type.path, { recursive: true, force: true });

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

function checkFileType(file_path_raw: string[]): {
  name: string;
  path: string;
  parentPath: string;
  type: "folder" | "file";
} | null {
  let type: "folder" | "file" = "folder";
  const duplicate_file_path_raw = [...file_path_raw];
  let document_name = duplicate_file_path_raw.pop() as string;
  const parent_path = duplicate_file_path_raw.join("/") as string;
  let full_path = path.posix.join(parent_path, document_name);

  if (fs.existsSync(full_path)) {
    // Directly found in the expected location
    type = fs.statSync(full_path).isDirectory() ? "folder" : "file";
  } else {
    document_name = hashFilename(document_name);
    full_path = path.posix.join(parent_path, document_name);

    if (fs.existsSync(full_path)) {
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
