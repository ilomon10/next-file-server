import { DocumentMap } from "@/components/blocks/document-map";
import { DocumentList } from "@/components/blocks/document-list";

export default async function Home(
  props: {
    params: Promise<{ folder: string[]; username: string }>;
  }
) {
  const { folder, username } = (await props.params);
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
