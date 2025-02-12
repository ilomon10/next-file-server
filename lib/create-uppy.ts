import Uppy, { Meta } from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import { DashboardInlineOptions } from "@uppy/dashboard/lib/Dashboard";
import Tus from "@uppy/tus";

export type Metadata = Meta & {
  folder?: string;
};

export function createUppy(meta?: Metadata) {
  return new Uppy({
    meta: meta,
  }).use(Tus, {
    endpoint: "http://localhost:3000/api/upload",
    allowedMetaFields: true,
    // onBeforeRequest: (req, file) => {},
  });
}
