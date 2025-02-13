"use client";

import React from "react";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";

import "@cyntler/react-doc-viewer/dist/index.css";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";

export const DocumentViewer: React.FC<{
  file_path: string;
}> = ({ file_path }) => {
  const urls: IDocument[] = [
    {
      uri: `http://localhost:3000/files/${file_path}`,
    },
  ];

  return (
    <div className="rounded-md border">
      <div className="border-b p-2 flex">
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="blame">Blame</TabsTrigger>
          </TabsList>
        </Tabs>
        <span>{file_path}</span>
      </div>
      <div>
        <DocViewer documents={urls} pluginRenderers={DocViewerRenderers} />
      </div>
    </div>
  );
};
