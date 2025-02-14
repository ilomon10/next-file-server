import { DocumentList } from "@/components/blocks/document-list";
import { DocumentMap } from "@/components/blocks/document-map";

export default function Home(props: {
  params: { folder: string[]; username: string };
  searchParams: {};
}) {
  const { username } = props.params;

  return (
    <>
      <main className="container px-4 mx-auto max-w-4xl mt-6">
        <DocumentMap baseurl={`/${username}/tree`} folder={[]} />
        <DocumentList baseurl={`/${username}/tree`} folder={[]} />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </>
  );
}
