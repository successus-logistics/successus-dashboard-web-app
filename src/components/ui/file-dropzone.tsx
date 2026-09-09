"use client";
import { CloudUpload, File } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import ImageField from "@/app/(main)/dashboard/drivers/_components/image-field";

export default function FileDropzone({
  name,
  allowed_ext,
  file,
  onChange,
}: {
  name: string;
  allowed_ext: string;
  file?: File;
  onChange?: (file: File | undefined) => void;
}) {
  const [fileSelected, setFileSelected] = useState(file);
  if (fileSelected) {
    return (
      <ImageField
        field=""
        image={fileSelected}
        deleteAction={() => onChange(undefined)}
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
      setFileSelected(file); // Saved in memory
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
        <EmptyDescription>Upload files.</EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="relative">
        <Button onClick={openFilePicker} variant={"outline"} size={"sm"}>
          Browse File
        </Button>
      </EmptyContent>
    </Empty>
  );
}
