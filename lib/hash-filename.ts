import { createHash as hash } from "node:crypto";

export const hashFilename = (filename: string) => {
  return hash("md5").update(filename).digest("hex");
};
