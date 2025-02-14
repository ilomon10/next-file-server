import fs from "fs";
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

  const folder_path = path.join("files", folder);

  const isExist = fs.existsSync(folder_path);
  if (isExist) {
    return Response.json(
      { status: 409, message: `Folder named \`${folder}\` already exist.` },
      { status: 409 }
    );
  }

  fs.mkdirSync(folder_path, { recursive: true });

  return new Response(undefined, { status: 204 });
}
