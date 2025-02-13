import { DocumentList } from "@/components/blocks/document-list";
import { DocumentMap } from "@/components/blocks/document-map";
import { DocumentViewer } from "@/components/blocks/document-viewer";

export default function Home(props: {
  params: { folder: string[]; username: string };
  searchParams: {};
}) {
  const { folder } = props.params;
  const file_path = folder.join("/");

  return (
    <>
      <main className="container px-4 mx-auto max-w-4xl mt-6">
        <DocumentMap folder={[]} />
        <DocumentViewer file_path={file_path} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </>
  );
}
