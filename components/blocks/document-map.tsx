import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export const DocumentMap: React.FC<{ baseurl: string; folder: string[] }> = (
  props
) => {
  const { folder, baseurl } = props;
  const temp_folder: string[] = [];

  return (
    <aside>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {folder.map((folder_name, index) => {
            const isLast = index === folder.length - 1;
            temp_folder.push(folder_name);
            const folder_path = temp_folder.join("/");
            return (
              <React.Fragment key={folder_name}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{folder_name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={`${baseurl}/${folder_path}`}>
                      {folder_name}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </aside>
  );
};
