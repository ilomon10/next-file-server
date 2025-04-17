"use client";

import React from "react";
import DocViewer, {
  DocViewerRenderers,
  IDocument,
} from "@cyntler/react-doc-viewer";

import "@cyntler/react-doc-viewer/dist/index.css";
import { Tabs, TabsTrigger, TabsList, TabsContent } from "@/components/ui/tabs";
import { SITE_URL } from "@/lib/constants";
import { DocumentViewerCode } from "./document-viewer-code";

export const DocumentViewer: React.FC<{
  file_path: string;
}> = ({ file_path }) => {
  const file_type = file_path.split(".").pop() || "text";
  const urls: IDocument[] = [
    {
      uri: `${SITE_URL}/files/${file_path}`,
      fileType: file_type,
    },
  ];

  const supported_type = SUPPORTED_TYPE[file_type] ?? [];

  return (
    <Tabs defaultValue={supported_type[0] ?? "blame"}>
      <div className="rounded-md border">
        <div className="border-b p-2 flex">
          <TabsList>
            {supported_type.map((v) => {
              switch (v) {
                case "code":
                  return (
                    <TabsTrigger key={v} value="code">
                      Code
                    </TabsTrigger>
                  );
                case "preview":
                  return (
                    <TabsTrigger key={v} value="preview">
                      Preview
                    </TabsTrigger>
                  );
                default:
                  return null;
              }
            })}
            <TabsTrigger value="blame">Blame</TabsTrigger>
          </TabsList>
          <span>{file_path}</span>
        </div>
        <div>
          {supported_type.map((v) => {
            switch (v) {
              case "code":
                return (
                  <TabsContent key={v} value="code">
                    <DocumentViewerCode document={urls[0]} />
                  </TabsContent>
                );
              case "preview":
                return (
                  <TabsContent key={v} value="preview">
                    <DocViewer
                      documents={urls}
                      pluginRenderers={DocViewerRenderers}
                    />
                  </TabsContent>
                );
              default:
                return null;
            }
          })}
        </div>
      </div>
    </Tabs>
  );
};

const SUPPORTED_TYPE: {
  [key: string]: string[];
} = {
  html: ["code"],
  jpeg: ["preview"],
  png: ["preview"],
};
