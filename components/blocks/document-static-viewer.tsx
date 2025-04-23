import React from "react";
import path from "node:path/posix";
import { IDocument } from "@cyntler/react-doc-viewer";

import { SITE_URL } from "@/lib/constants";
import { FileOrFolder } from "@/app/api/list_files/route";
import { Button } from "@/components/ui/button";
import { DocumentViewerCode } from "./document-viewer-code";
import { DocumentViewerPreview } from "./document-viewer-preview";

export const DocumentStaticViewer: React.FC<{
  file: FileOrFolder;
  viewtype: ViewType | undefined;
  description?: React.ReactNode;
}> = ({ file, viewtype, description }) => {
  const file_type = file.name.split(".").pop() || "txt";
  const file_path = path.join(file.parentPath, file.name);
  const document: IDocument = {
    uri: `${SITE_URL}/files/blob/${file_path}`,
    fileType: file_type,
  };

  const supported_view = SUPPORTED_TYPE[file_type] ?? SUPPORTED_TYPE["txt"];

  const resolveView = () => {
    const resolved_type = supported_view.includes(
      viewtype as unknown as ViewType
    )
      ? viewtype
      : supported_view[0];

    switch (resolved_type) {
      case "preview":
        return <DocumentViewerPreview document={document} />;
      case "code":
        return <DocumentViewerCode document={document} />;
      default:
        return null;
    }
  };

  return (
    <div className="rounded-md border">
      <div className="border-b px-4 py-2 flex items-center">
        {supported_view.length > 1 && (
          <div className="mr-2">
            {supported_view.map((v) => {
              return (
                <Button key={v} value={v} className="capitalize">
                  {v}
                </Button>
              );
            })}
          </div>
        )}
        {description}
      </div>
      <div>{resolveView()}</div>
    </div>
  );
};

type ViewType = "preview" | "code" | "blame";

const SUPPORTED_TYPE: Record<string, ViewType[]> = {
  // Code and markup
  html: ["code"],
  md: ["preview", "code"],
  txt: ["code"],
  js: ["code"],
  ts: ["code"],
  json: ["code"],
  xml: ["code"],
  css: ["code"],
  csv: ["code"],
  yaml: ["code"],
  yml: ["code"],

  // Images
  jpg: ["preview"],
  jpeg: ["preview"],
  png: ["preview"],
  gif: ["preview"],
  svg: ["preview"],
  bmp: ["preview"],
  webp: ["preview"],
  psd: ["preview"],

  // Audio
  mp3: ["preview"],
  wav: ["preview"],
  ogg: ["preview"],
  flac: ["preview"],

  // Video
  mp4: ["preview"],
  webm: ["preview"],
  mov: ["preview"],

  // Documents
  pdf: ["preview"],
  doc: ["preview"],
  docx: ["preview"],
  xls: ["preview"],
  xlsx: ["preview"],
  ppt: ["preview"],
  pptx: ["preview"],

  // Archives
  zip: ["preview"],
  rar: ["preview"],
  tar: ["preview"],
  gz: ["preview"],

  // Others
  log: ["code"],
  db: ["preview"],
  ini: ["code"],
  conf: ["code"],
} as const;
