import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import { DashboardInlineOptions } from "@uppy/dashboard/lib/Dashboard";
import Tus from "@uppy/tus";

export function createUppy(dashboardOptions?: DashboardInlineOptions) {
  return new Uppy().use(Tus, {
    endpoint: "http://localhost:3000/api/upload",
  });
}
