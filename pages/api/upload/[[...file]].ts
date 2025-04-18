import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "@tus/server";
import { hashFilename } from "@/lib/hash-filename";
import CONSTANTS from "@/lib/constants";
import storage from "@/lib/storage";

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
  datastore: storage.tus_storage,
  respectForwardedHeaders: CONSTANTS.SITE_PROTO === "https" ? true : false,
  namingFunction(req, metadata) {
    const id = hashFilename(metadata?.filename as string);
    const folder = metadata?.folder || "";
    return storage.join(folder, id);
  },
  generateUrl(req, options) {
    const { proto, host, path } = options;
    const id = Buffer.from(options.id, "utf-8").toString("base64url");
    const protocol =
      req.headers["x-real-proto"] || req.headers["x-forwarded-proto"] || proto;
    console.log(
      "generateUrl",
      protocol,
      { proto, host, path, id },
      req.headers
    );
    return `${protocol}://${host}${path}/${id}`;
  },
  getFileIdFromRequest(req, lastPath) {
    // lastPath is everything after the last `/`
    // If your custom URL is different, this might be undefined
    // and you need to extract the ID yourself
    const result = Buffer.from(lastPath as string, "base64url").toString(
      "utf-8"
    );
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  res.status((result as any).status).end();
}
