import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "@tus/server";
import { FileStore } from "@tus/file-store";

/**
 * !Important. This will tell Next.js NOT Parse the body as tus requires
 * @see https://nextjs.org/docs/api-routes/request-helpers
 */
export const config = {
  api: {
    bodyParser: false,
  },
};

const tusServer = new Server({
  // `path` needs to match the route declared by the next file router
  path: "/api/upload",
  datastore: new FileStore({ directory: "./files" }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await tusServer.handle(req, res);
  res.status((result as any).status).end();
}
