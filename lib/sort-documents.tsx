import { DocumentFile } from "@/components/blocks/data-table";

export const sortDocuments = (data: DocumentFile[]) => {
  const typeOrder = { back: 0, folder: 1, file: 2 };

  const result = data.sort((a, b) => {
    // Sort by type priority
    if (typeOrder[a.type] !== typeOrder[b.type]) {
      return typeOrder[a.type] - typeOrder[b.type];
    }
    // If same type, sort alphabetically by filename
    return a.filename.localeCompare(b.filename);
  });

  return result;
};
