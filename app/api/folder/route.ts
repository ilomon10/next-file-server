import storage, { client_storage } from "@/lib/storage";
import { NextRequest } from "next/server";
import path from "path";

type Folder_POST_BODY = {
  folder: string;
};

export async function POST(req: NextRequest) {
  const json: Folder_POST_BODY = await req.json();
  const { folder } = json;
  if (!folder) {
    return Response.json(
      { status: 400, message: "Bad request" },
      { status: 400 }
    );
  }

  const folder_path = path.posix.join(storage.directory, folder);

  const isExist = await client_storage.exists(folder_path);
  if (isExist) {
    return Response.json(
      { status: 409, message: `Folder named \`${folder}\` already exist.` },
      { status: 409 }
    );
  }

  await client_storage.mkdir(folder_path, true);

  return new Response(undefined, { status: 204 });
}

export async function DELETE(req: NextRequest) {
  const json: Folder_POST_BODY = await req.json();

  const { folder } = json;

  if (!folder) {
    return Response.json(
      { status: 400, message: "Bad request" },
      { status: 400 }
    );
  }

  const folder_path = path.posix.join(storage.directory, folder);

  const isExist = await client_storage.exists(folder_path);
  if (!isExist) {
    return Response.json(
      { status: 409, message: `Folder named \`${folder}\` not exist.` },
      { status: 409 }
    );
  }

  await client_storage.rm(folder_path, true);

  return new Response(undefined, { status: 204 });
}
