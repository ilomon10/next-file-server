import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { hashFilename } from "@/lib/hash-filename";
import storage, { client_storage } from "@/lib/storage";
import CONSTANTS from "@/lib/constants";

export const GET = async (
  req: NextRequest,
  props: { params: { filepath: string[] } }
) => {
  const { filepath } = props.params;

  const [file_name, ...full_path] = filepath.reverse();

  const hashed_filename = hashFilename(file_name);

  const bin_filepath = path.posix.join(
    storage.directory,
    ...full_path.reverse(),
    hashed_filename
  );
  const json_filepath = `${bin_filepath}${
    CONSTANTS.STORAGE_TYPE === "local" ? ".json" : ".info"
  }`;
  const raw_file = await client_storage.readFile(json_filepath);
  const { metadata } = JSON.parse(raw_file);

  const fileName = metadata.filename || "downloaded-file";
  const mimeType = metadata.filetype || "application/octet-stream";

  const fileContent = await client_storage.readFile(bin_filepath);

  return new NextResponse(fileContent, {
    status: 200,
    headers: new Headers({
      "Content-Disposition": `attachment; filename=${fileName}`,
      "Content-Type": mimeType,
    }),
  });
};
