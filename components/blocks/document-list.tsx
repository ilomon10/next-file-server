"use client";

import React from "react";
import { DataTable, DocumentFile } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { getListFiles } from "@/lib/client/client-adapter";
import { sortDocuments } from "@/lib/sort-documents";
import path from "path";

function getPreviousPath(path: string) {
  if (path === "/" || !path.includes("/")) return "/"; // If already root or no slashes, return "/"

  const previous = path.substring(0, path.lastIndexOf("/"));
  return previous === "" ? "/" : previous; // Ensure root remains "/"
}

export const DocumentList: React.FC<{
  folder: string[];
  baseurl: string;
}> = (props) => {
  const { folder, baseurl } = props;
  const folderString = folder.join("/");

  const { data, refetch } = useQuery<DocumentFile[]>({
    queryKey: [folder, "file-list"],
    queryFn: async () => {
      const files = await getListFiles(folderString);
      const result = files.data.map<DocumentFile>((file) => {
        return {
          id: file.id,
          filename: file.name,
          file_url: path.join(
            file.type === "folder" ? baseurl : "/files",
            file.parentPath,
            file.type === "file" ? file.id : file.name
          ),
          type: file.type,
          size: (file as any).size,
          created_at: (file as any).creation_date,
        };
      });

      const prevPath = getPreviousPath(`${baseurl}/${folderString}`);

      if (folder.length > 0)
        result.push({
          id: "back",
          filename: ". .",
          file_url: prevPath,
          type: "back",
          size: 0,
          created_at: "",
        });

      sortDocuments(result);

      return result;
    },
  });

  const onUpload = () => {
    refetch();
  };

  return (
    <DataTable onUploaded={onUpload} data={data || []} folder={folderString} />
  );
};
