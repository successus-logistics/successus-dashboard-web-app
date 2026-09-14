"use client";
import { CloudUpload } from "lucide-react";
import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import ImageField from "@/app/(main)/dashboard/drivers/_components/image-field";
import { AttachmentType } from "@/app/(main)/dashboard/drivers/types";

export default function FileDropzone({
  name,
  allowed_ext,
  file,
  addFile,
  removeFile,
}: {
  name: string;
  allowed_ext?: string;
  file?: AttachmentType | undefined;
  onChange?: (file: File | undefined) => void;
  addFile?: (file: File) => void;
  removeFile?: (file: AttachmentType) => void;
}) {
  if (file?.file) {
    return (
      <ImageField
        field={file.file?.name}
        image={file.file}
        deleteAction={() => {
          //onChange(selectedFile, "delete");
          if (removeFile) removeFile(file);
        }}
      />
    );
  }

  const openFilePicker = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Images and Docs",
            accept: {
              "image/*": [".png", ".jpeg", ".jpg"],
              "application/pdf": [".pdf"],
            },
          },
        ],
      });

      const file = await fileHandle.getFile();
      if (addFile) addFile(file);
    } catch (err) {
      console.log("User cancelled or browser unsupported", err);
    }
  };

  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CloudUpload />
        </EmptyMedia>
        <EmptyTitle>Upload File</EmptyTitle>
        <EmptyDescription>Select file to upload</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="relative">
        <Button
          type="button"
          onClick={openFilePicker}
          variant={"outline"}
          size={"sm"}
        >
          Browse Files
        </Button>
      </EmptyContent>
    </Empty>
  );
}
