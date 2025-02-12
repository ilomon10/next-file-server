import { NextRequest, NextResponse } from "next/server";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";

export const GET = async (
  req: NextRequest,
  props: { params: { filepath: string[] } }
) => {
  const { filepath: full_path } = props.params;
  const bin_filepath = path.join("files", ...full_path);
  const json_filepath = `${bin_filepath}.json`;

  const { metadata } = JSON.parse(fs.readFileSync(json_filepath, "utf-8"));

  const fileName = metadata.filename || "downloaded-file";
  const mimeType = metadata.filetype || "application/octet-stream";

  const fileContent = await fsPromises.readFile(bin_filepath);

  return new NextResponse(fileContent, {
    status: 200,
    headers: new Headers({
      "Content-Disposition": `attachment; filename=${fileName}`,
      "Content-Type": mimeType,
    }),
  });
};
