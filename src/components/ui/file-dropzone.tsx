"use client";
import { File } from "lucide-react";
import { Input } from "./input";
import { Button } from "./button";
import { useState } from "react";

export default function FileDropzone({
  name,
  allowed_ext,
  onChange,
}: {
  name: string;
  allowed_ext: string;
  onChange: (file: FileList) => void;
}) {
  const [fileSelected, setFileSelected] = useState("");
  return (
    <div className="border text-sm font-bold border-gray-500 bg-muted border-dashed rounded-xl grid place-items-center place-content-center gap-2 h-36 p-4 relative col-span-full">
      {fileSelected ? (
        <>
          <File color="green" className="mb-0" size={30} />
          <div className="font-light text-muted-foreground text-center text-xs">
            {fileSelected}
            <br />
          </div>
        </>
      ) : (
        <>
          <File color="gray" className="mb-0" size={30} />
          Drag your files here or browse files
          <div className="font-light text-muted-foreground text-center text-xs">
            {allowed_ext} up to 20mb
            <br />
          </div>
        </>
      )}
      <Button variant={"outline"} size={"sm"}>
        Browse File
      </Button>
      <Input
        accept={allowed_ext}
        onChange={(e) => {
          setFileSelected(e.target.files[0].name ?? "");
          onChange(e.target.files[0]!);
        }}
        type="file"
        name={name}
        className="absolute inset-0 h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
