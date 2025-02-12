import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from "react";

export const DocumentMap: React.FC<{ folder: string[] }> = (props) => {
  const { folder } = props;

  return (
    <aside>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          {folder.map((folder_name, index) => {
            const isLast = index === folder.length - 1;
            return (
              <React.Fragment key={folder_name}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{folder_name}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href="/">{folder_name}</BreadcrumbLink>
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
