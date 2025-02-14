"use client";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertCircle, FolderIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { postFolder } from "@/lib/client/client-adapter";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AxiosError } from "axios";
import { Separator } from "@/components/ui/separator";
import { createUppy } from "@/lib/create-uppy";
import Dashboard from "@uppy/react/lib/Dashboard";

export const NewItemButton: React.FC<{
  folder: string;
  onCancel?: () => void;
  onSubmitted?: () => void;
}> = ({ folder, onCancel, onSubmitted }) => {
  const [dialog, setDialog] = React.useState<
    "new-folder" | "upload-file" | "upload-folder" | null
  >(null);

  const handleSubmitted = () => {
    onSubmitted?.();
    setDialog(null);
  };

  const handleCancel = () => {
    onCancel?.();
    setDialog(null);
  };

  return (
    <>
      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDialog(null);
          }
        }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"outline"}>
              <PlusIcon />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              onSelect={() => {
                setDialog("new-folder");
              }}
            >
              <FolderIcon />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => {
                setDialog("upload-file");
              }}
            >
              <PlusIcon />
              File Upload
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setDialog("upload-folder");
              }}
            >
              <FolderIcon />
              Folder Upload
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DialogContent className="max-w-[750px]">
          {dialog === "new-folder" && (
            <CreateNewFolder
              folder={folder}
              onSubmitted={handleSubmitted}
              onCancel={handleCancel}
            />
          )}
          {dialog === "upload-file" && (
            <UploadFile
              folder={folder}
              onSubmitted={handleSubmitted}
              onCancel={handleCancel}
            />
          )}
          {/* {dialog === "upload-folder" && <CreateNewFolder />} */}
        </DialogContent>
      </Dialog>
    </>
  );
};

const formSchema = z.object({
  folder_name: z
    .string()
    .min(1, "Folder name cannot be empty")
    .max(255, "Folder name is too long")
    .regex(
      /^[a-zA-Z0-9_\- ]+$/,
      "Invalid folder name: Only letters, numbers, spaces, underscores, and hyphens are allowed"
    ),
});

const CreateNewFolder: React.FC<{
  folder: string;
  onCancel?: () => void;
  onSubmitting?: () => void;
  onSubmitted?: () => void;
}> = ({ folder, onCancel, onSubmitted }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folder_name: "",
    },
  });

  const handleCreate = async (data: z.infer<typeof formSchema>) => {
    try {
      await postFolder(`${folder}/${data.folder_name}`);
      await onSubmitted?.();
    } catch (err) {
      form.setError("root", {
        type: "manual",
        message: ((err as AxiosError).response?.data as any).message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreate)} className="space-y-4">
        <DialogHeader>
          <DialogTitle>New folder name</DialogTitle>
          <DialogDescription>
            Write your new folder name below
          </DialogDescription>
        </DialogHeader>
        <FormField
          control={form.control}
          name="folder_name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Folder name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button variant="ghost" type="button" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant="ghost"
            type={"submit"}
            loading={form.formState.isSubmitting}
          >
            Create
          </Button>
        </DialogFooter>

        {form.formState.errors.root && (
          <>
            <Separator />
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {form.formState.errors.root.message}
              </AlertDescription>
            </Alert>
          </>
        )}
      </form>
    </Form>
  );
};

const UploadFile: React.FC<{
  folder: string;
  onCancel?: () => void;
  onSubmitting?: () => void;
  onSubmitted?: () => void;
}> = ({ folder, onSubmitted, onCancel }) => {
  const [uppy] = React.useState(createUppy({ folder: folder }));

  React.useEffect(() => {
    uppy.setMeta({ folder: folder });
    uppy.on("complete", () => {
      onSubmitted?.();
    });
  }, [folder]);

  return (
    <>
      <DialogHeader>
        <DialogTitle>Upload file</DialogTitle>
      </DialogHeader>
      <Dashboard
        id="upload-file"
        width={"100%"}
        uppy={uppy}
        onRequestCloseModal={() => {
          onCancel?.();
        }}
      />
    </>
  );
};
