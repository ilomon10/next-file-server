import { DocumentMap } from "@/components/blocks/document-map";
import { DocumentViewer } from "@/components/blocks/document-viewer";
import { file_collection } from "@/lib/client/client-adapter";
import byteSize from "byte-size";
import { Metadata } from "next";

type BlobRouteProps = {
  params: Promise<{ filepath: string[]; username: string }>;
};

export default async function BlobRoute(props: BlobRouteProps) {
  const { filepath, username } = (await props.params);
  const file_path = filepath.join("/");
  const file = (await file_collection().get(file_path)).data[0];
  if (file.type !== "file") return <div>File not found</div>;

  return (
    <>
      <main className="container px-4 mx-auto max-w-4xl mt-6">
        <DocumentMap baseurl={`/${username}/tree`} folder={filepath || []} />
        <div className="pt-4" />
        <DocumentViewer
          file_path={file_path}
          description={
            <span className="text-muted-foreground">
              {byteSize(file.size).toString()}
            </span>
          }
        />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </>
  );
}

export async function generateMetadata(props: BlobRouteProps): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `${params.filepath.join("/")} at ${params.username}`,
  };
}
