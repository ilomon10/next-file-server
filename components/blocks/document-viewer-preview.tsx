"use client";

import React from "react";
import DocViewer, { IDocument, PDFRenderer } from "@cyntler/react-doc-viewer";

import "@cyntler/react-doc-viewer/dist/index.css";
import PNGRenderer from "./document-renderer/png-renderer";

export const DocumentViewerPreview: React.FC<{
  document: IDocument;
}> = ({ document }) => {
  return (
    <DocViewer
      documents={[document]}
      initialActiveDocument={document}
      pluginRenderers={[PDFRenderer, PNGRenderer]}
      config={{ header: { disableHeader: true } }}
    />
  );
};
