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
  description?: React.ReactNode;
}> = ({ file_path, description }) => {
  const file_type = file_path.split(".").pop() || "txt";
  const urls: IDocument[] = [
    {
      uri: `${SITE_URL}/files/blob/${file_path}`,
      fileType: file_type,
    },
  ];

  const supported_type = SUPPORTED_TYPE[file_type] ?? SUPPORTED_TYPE["txt"];

  return (
    <Tabs defaultValue={supported_type[0] ?? "preview"}>
      <div className="rounded-md border">
        <div className="border-b p-2 flex items-center">
          <TabsList className="mr-2">
            {supported_type.map((v) => {
              return (
                <TabsTrigger key={v} value={v} className="capitalize">
                  {v}
                </TabsTrigger>
              );
            })}
          </TabsList>
          {description}
        </div>
        <div>
          {supported_type.map((v) => {
            let result: React.ReactNode = "Not Found";
            switch (v) {
              case "preview":
                result = (
                  <DocViewer
                    documents={urls}
                    initialActiveDocument={urls[0]}
                    pluginRenderers={DocViewerRenderers}
                  />
                );
                break;
              case "code":
                result = <DocumentViewerCode document={urls[0]} />;
                break;
              case "blame":
                result = "Blame";
                break;
            }

            return (
              <TabsContent key={v} value={v}>
                {result}
              </TabsContent>
            );
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
  wav: ["preview"],
  mp3: ["preview"],
  rar: ["preview"],
  txt: ["code"],
};
