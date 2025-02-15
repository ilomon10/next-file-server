import { DocumentMap } from "@/components/blocks/document-map";
import { DocumentList } from "@/components/blocks/document-list";

export default function Home(props: {
  params: { folder: string[]; username: string };
  searchParams: {};
}) {
  const { folder, username } = props.params;
  const baseurl = `/${username}/tree`;

  return (
    <>
      <main className="container px-4 mx-auto max-w-4xl mt-6">
        <DocumentMap baseurl={baseurl} folder={folder || []} />
        <DocumentList baseurl={baseurl} folder={folder || []} />
      </main>
      <footer className="h-[25vh] row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </>
  );
}
