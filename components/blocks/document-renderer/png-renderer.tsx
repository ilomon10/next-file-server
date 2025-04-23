import React from "react";
import { DocRenderer } from "@cyntler/react-doc-viewer";
import "@/styles/png-renderer.css";
import Image from "next/image";

const PNGRenderer: DocRenderer = (props) => {
  const document = props.mainState.currentDocument;
  if (!document) return null;
  return (
    <div id="png-renderer">
      <Image
        src={document.fileData as string}
        alt={document.fileName || "Document Renderer"}
      />
    </div>
  );
};

PNGRenderer.fileTypes = ["png", "image/png"];
PNGRenderer.weight = 0;

export default PNGRenderer;
