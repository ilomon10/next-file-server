"use client";

import React from "react";
import { DataTable, DocumentFile } from "./data-table";
import { useQuery } from "@tanstack/react-query";
import { file_collection } from "@/lib/client/client-adapter";
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
      const files = await file_collection().get(folderString);

      const result = files.data.map<DocumentFile>((file) => {
        let file_url = path.posix.join(baseurl, file.parentPath, file.name);

        if (file.type === "file") {
          file_url = file_url.replace("tree", "blob");
        }

        const result = {
          id: file.id,
          filename: file.name,
          file_url: file_url,
          type: file.type,
        };

        if (file.type === "file") {
          return {
            ...result,
            size: file.size,
            created_at: file.creation_date,
          };
        } else {
          return {
            ...result,
            size: 0,
            created_at: "",
          };
        }
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
