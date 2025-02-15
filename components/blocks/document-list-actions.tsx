import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import React from "react";
import { DocumentFile } from "./data-table";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { file_collection } from "@/lib/client/client-adapter";
import { useDisclosure } from "@/lib/use-disclosure";

export const DocumentListActions: React.FC<{
  item: DocumentFile;
  onSubmitted: () => void;
}> = ({ item, onSubmitted }) => {
  const [dialog, setDialog] = React.useState<"delete" | null>(null);

  const cleanPath = item.file_url.split("/").slice(3).join("/");

  const handleSubmit = () => {
    setDialog(null);
    onSubmitted?.();
  };

  return (
    <AlertDialog open={dialog !== null}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(item.id)}
          >
            Open
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600"
            onSelect={() => setDialog("delete")}
          >
            <Trash2Icon />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        {dialog === "delete" && (
          <DeleteAction file={cleanPath} onSubmitted={handleSubmit} />
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
};

const DeleteAction: React.FC<{
  file: string;
  onCancel?: () => void;
  onSubmitting?: () => void;
  onSubmitted?: () => void;
}> = ({ file, onSubmitted }) => {
  const [isLoading, { toggle }] = useDisclosure({ initialValue: false });
  const handleSubmit = async () => {
    toggle();
    await file_collection().del(file);
    onSubmitted?.();
  };
  return (
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button
          onClick={handleSubmit}
          variant="destructive"
          loading={isLoading}
        >
          Delete
        </Button>
      </AlertDialogFooter>
    </>
  );
};
