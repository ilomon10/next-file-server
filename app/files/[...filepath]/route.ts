import { NextRequest, NextResponse } from "next/server";
import fsPromises from "fs/promises";
import fs from "fs";
import path from "path";
import { hashFilename } from "@/lib/hash-filename";

export const GET = async (
  req: NextRequest,
  props: { params: { filepath: string[] } }
) => {
  const { filepath } = props.params;

  const [file_name, ...full_path] = filepath.reverse();

  const hashed_filename = hashFilename(file_name);

  const bin_filepath = path.join(
    "files",
    ...full_path.reverse(),
    hashed_filename
  );
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
