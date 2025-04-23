import React from "react";
import { DocRenderer } from "@cyntler/react-doc-viewer";
import "@/styles/png-renderer.css";

const PNGRenderer: DocRenderer = (props) => {
  const document = props.mainState.currentDocument;
  if (!document) return null;
  return (
    <div id="png-renderer">
      <img src={document.fileData as string} />
    </div>
  );
};

PNGRenderer.fileTypes = ["png", "image/png"];
PNGRenderer.weight = 0;

export default PNGRenderer;
