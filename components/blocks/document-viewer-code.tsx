import { IDocument } from "@cyntler/react-doc-viewer";
import React from "react";
import CodeToBlock from "react-shiki";

export const DocumentViewerCode: React.FC<{
  document: IDocument;
}> = ({ document }) => {
  const [code, setCode] = React.useState("Loading...");
  React.useLayoutEffect(() => {
    const fetchCode = async () => {
      try {
        const code = await fetchRemoteFile(document.uri);
        setCode(code);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setCode(`⚠️ Failed to load file: ${errorMessage}`);
      }
    };
    fetchCode();
  }, [document.uri]);

  return (
    <CodeToBlock language={"html"} theme={"github-light"}>
      {code}
    </CodeToBlock>
  );
};

const fetchRemoteFile = async (url: string): Promise<string> => {
  const res = await fetch(url);
  if (!res.ok) throw Error(`HTTP ${res.status}`);
  const file = res.text();
  return file;
};
