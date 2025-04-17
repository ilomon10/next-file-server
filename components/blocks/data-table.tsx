"use client";

import * as React from "react";
import moment from "moment";
import byteSize from "byte-size";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import { NewItemButton } from "./new-item-button";
import { DocumentListActions } from "./document-list-actions";

export type DocumentFile = {
  id: string;
  filename: string;
  file_url: string;
  type: "file" | "folder" | "back";
  format?: string;
  size: number;
  created_at: string;
  updated_at?: string;
};

export const columns: ColumnDef<DocumentFile>[] = [
  {
    id: "select",
    maxSize: 40,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) =>
      row.original.type !== "back" && (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "filename",
    header: "File Name",
    cell: ({ row }) =>
      row.original.id === "back" ? (
        <Link href={row.original.file_url} className="block font-medium">
          {row.getValue("filename")}
        </Link>
      ) : (
        <div>
          <Link
            href={row.original.file_url}
            className="inline-block font-medium"
          >
            {row.getValue("filename")}
          </Link>
        </div>
      ),
  },
  {
    accessorKey: "size",

    header: () => {
      return <div className="text-right">Size</div>;
    },
    cell: ({ row }) => {
      const formatted = byteSize(row.getValue("size")).toString();
      const value = row.original.type === "folder" ? "Folder" : formatted;
      return (
        row.original.type !== "back" && (
          <div className="text-right text-muted-foreground">{value}</div>
        )
      );
    },
  },
  {
    accessorKey: "created_at",
    header: () => <div className="text-right">Time</div>,
    cell: ({ row }) => {
      const time = row.getValue("created_at");

      // Format the amount as a dollar amount
      const formatted = moment(time as string).format("MMM D, YYYY - HH:mm A");

      return (
        row.original.type !== "back" && (
          <div className="text-right text-muted-foreground">
            {row.original.type === "file" ? formatted : ""}
          </div>
        )
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    maxSize: 40,
    cell: (props) => {
      const { row, onSubmitted } = props as typeof props & {
        onSubmitted: () => void;
      };
      const item = props.row.original;
      if (item.type === "back") return null;

      return (
        <DocumentListActions onSubmitted={onSubmitted} item={row.original} />
      );
    },
  },
];

export function DataTable({
  folder,
  data,
  onUploaded,
}: {
  folder: string;
  data: DocumentFile[];
  onUploaded?: () => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <NewItemButton folder={folder} onSubmitted={onUploaded} />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, {
                        ...cell.getContext(),
                        onSubmitted: () => onUploaded?.(),
                      })}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
      </div>
    </div>
  );
}
