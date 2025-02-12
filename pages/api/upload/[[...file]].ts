import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";
import { nanoid } from "nanoid";

/**
 * !Important. This will tell Next.js NOT Parse the body as tus requires
 * @see https://nextjs.org/docs/api-routes/request-helpers
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

const path = "/api/upload";

const tusServer = new Server({
  // `path` needs to match the route declared by the next file router
  path: path,
  datastore: new FileStore({ directory: "./files" }),
  namingFunction(req, metadata) {
    const id = nanoid();
    console.log("naming", metadata);
    const folder = metadata?.folder || "default";
    return `${folder}/${id}`;
  },
  generateUrl(req, options) {
    let { proto, host, path, id } = options;
    id = Buffer.from(id, "utf-8").toString("base64url");
    // console.log("generateUrl", options, id, `${proto}://${host}${path}/${id}`);
    return `${proto}://${host}${path}/${id}`;
  },
  getFileIdFromRequest(req, lastPath) {
    // lastPath is everything after the last `/`
    // If your custom URL is different, this might be undefined
    // and you need to extract the ID yourself
    const result = Buffer.from(lastPath as any, "base64url").toString("utf-8");
    // console.log("getFileIdFromRequest", lastPath, result);
    return result;
  },
  async onUploadCreate(req, res, upload) {
    // const {ok, expected, received} = validateMetadata(upload) // your logic
    // if (!ok) {
    //   const body = `Expected "${expected}" in "Upload-Metadata" but received "${received}"`
    //   throw {status_code: 500, body} // if undefined, falls back to 500 with "Internal server error".
    // }
    // You can optionally return metadata to override the upload metadata,
    // such as `{ storagePath: "/upload/123abc..." }`
    // const extraMeta = getExtraMetadata(req) // your logic
    // console.log(upload);
    return { res, metadata: { ...upload.metadata } };
  },
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await tusServer.handle(req, res);
  res.status((result as any).status).end();
}
