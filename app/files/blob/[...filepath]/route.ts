import { NextRequest, NextResponse } from "next/server";
import { hashFilename } from "@/lib/hash-filename";
import storage, { client_storage } from "@/lib/storage";
import CONSTANTS from "@/lib/constants";

export const GET = async (
  req: NextRequest,
  props: { params: Promise<{ filepath: string[] }> }
) => {
  const { filepath } = (await props.params);

  const [file_name, ...full_path] = filepath.reverse();

  const hashed_filename = hashFilename(file_name);

  const bin_filepath = storage.join(...full_path.reverse(), hashed_filename);
  const json_filepath = `${bin_filepath}${
    CONSTANTS.STORAGE_TYPE === "local" ? ".json" : ".info"
  }`;
  const raw_file = await client_storage.readFile(json_filepath, "utf-8");
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
