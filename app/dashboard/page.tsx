"use client";

import Uppy from "@uppy/core";
// For now, if you do not want to install UI components you
// are not using import from lib directly.
import Dashboard from "@uppy/react/lib/Dashboard";
import { useState } from "react";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { createUppy } from "@/lib/create-uppy";

export default function UppyDashboard() {
  // Important: use an initializer function to prevent the state from recreating.
  const [uppy] = useState(createUppy);

  return (
    <Dashboard
      // width={"100%"}
      theme="dark"
      uppy={uppy}
    />
  );
}
