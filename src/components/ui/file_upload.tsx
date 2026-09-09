import { PlusCircle } from "lucide-react";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Field, FieldLabel } from "./field";
import { DatePickerInput } from "./date-picker";
import { Input } from "./input";
import { useState } from "react";
import FileDropzone from "./file-dropzone";

const fileType = {
  image: ".png, webp, .jpg, .jpeg",
  document: ".pdf, .docx, .doc",
} as const;

export default function FileUpload() {
  const [fileSelected, setFileSelected] = useState<File | undefined>(undefined);
  const [type, setType] = useState<keyof typeof fileType>("image");
  const [startDate, setStartDate] = useState<string | undefined>();
  const [expiryDate, setExpiryDate] = useState<string | undefined>();
  console.log("rendered");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <PlusCircle />
          Add File
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New File Upload</DialogTitle>
          <DialogDescription>
            Please fill out the following fields to upload your file
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel>Start Date</FieldLabel>
          <DatePickerInput
            dateValue={startDate}
            updateDateValue={(newDate) => {
              if (newDate) setStartDate(newDate);
            }}
          />
        </Field>
        <Field>
          <FieldLabel>Expiry Date</FieldLabel>
          <DatePickerInput
            dateValue={expiryDate}
            updateDateValue={(newDate) => {
              if (newDate) setExpiryDate(newDate);
            }}
          />
        </Field>
        <Field>
          <FieldLabel>Document</FieldLabel>
          <FileDropzone
            allowed_ext={fileType[type]}
            name={type}
            file={fileSelected}
            onChange={(file) => {
              console.log("file", file, fileSelected);
              setFileSelected(file);
            }}
          />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
