import { DocumentMap } from "@/components/blocks/document-map";
import { DocumentStaticViewer } from "@/components/blocks/document-static-viewer";
import { Button } from "@/components/ui/button";
import { file_collection } from "@/lib/client/client-adapter";
import CONSTANTS from "@/lib/constants";
import byteSize from "byte-size";
import { Metadata } from "next";

type BlobRouteProps = {
  params: Promise<{ filepath: string[]; username: string }>;
  searchParams: Promise<{ plain: string }>;
};

export default async function BlobRoute(props: BlobRouteProps) {
  const { filepath, username } = await props.params;
  const searchParams = await props.searchParams;
  const file_path = filepath.join("/");
  const file = await file_collection().get(file_path);

  if (file.type !== "file") return <div>File not found</div>;
  const viewtype = searchParams.plain === "1" ? "code" : undefined;

  return (
    <>
      <main className="container px-4 mx-auto max-w-4xl mt-6">
        <DocumentMap baseurl={`/${username}/tree`} folder={filepath || []} />
        <div className="pt-4" />
        <DocumentStaticViewer
          file={file}
          viewtype={viewtype}
          description={
            <div className="w-full flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                {byteSize(file.size).toString()}
              </span>
              <Button variant={"outline"} size={"sm"}>
                <a href={`${CONSTANTS.SITE_URL}/files/blob/${filepath}`}>Raw</a>
              </Button>
            </div>
          }
        />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </>
  );
}

export async function generateMetadata(
  props: BlobRouteProps
): Promise<Metadata> {
  const params = await props.params;
  return {
    title: `${params.filepath.join("/")} at ${params.username}`,
  };
}
