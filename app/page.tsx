import { DataTable } from "@/components/blocks/data-table";
import { DocumentMap } from "@/components/blocks/document-map";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <main className="container px-4 mx-auto max-w-4xl mt-6">
        <DocumentMap />
        <DataTable />
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </>
  );
}
