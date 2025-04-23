import Uppy, { Meta } from "@uppy/core";
import Tus from "@uppy/tus";
import { SITE_URL, SITE_PROTO } from "./constants";

export type Metadata = Meta & {
  folder?: string;
};

export function createUppy(meta?: Metadata) {
  return new Uppy({
    meta: meta,
  }).use(Tus, {
    endpoint: `${SITE_URL}/api/upload`,
    allowedMetaFields: true,
    chunkSize: 1024 * 1024 * 5,
    headers: {
      "X-Forwarded-Proto": SITE_PROTO,
      "X-Real-Proto": SITE_PROTO,
    },
  });
}
