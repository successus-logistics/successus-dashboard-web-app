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
import { Field, FieldError, FieldGroup, FieldLabel } from "./field";
import { DatePickerInput } from "./date-picker";
import { Input } from "./input";
import { useState } from "react";
import FileDropzone from "./file-dropzone";
import { AttachmentType } from "@/app/(main)/dashboard/drivers/types";

const fileType = {
  image: ".png, webp, .jpg, .jpeg",
  document: ".pdf, .docx, .doc",
} as const;

const EMPTYFILEINFORMATION = {
  file_name: "",
  file_type: "",
  start_date: undefined,
  expiry_date: undefined,
  file: undefined,
  file_size: 0,
};

export default function FileUpload({
  addFile,
}: {
  addFile: (name: string, file: AttachmentType) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  const [fileInformation, setFileInformation] =
    useState<AttachmentType>(EMPTYFILEINFORMATION);
  console.log("changed", fileInformation);
  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        setFileInformation(EMPTYFILEINFORMATION);
        setIsInvalid(false);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <PlusCircle />
          Add File
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:min-w-xl"
        onOpenAutoFocus={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>New File Upload</DialogTitle>
          <DialogDescription>
            Please fill out the following fields to upload your file
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="grid grid-cols-2">
          <Field className="col-span-full">
            <FieldLabel htmlFor="file_name" required>
              File Name
            </FieldLabel>
            <Input
              id="file_name"
              name="file_name"
              placeholder="file name"
              onChange={(e) =>
                setFileInformation((prev) => ({
                  ...prev,
                  file_name: e.target.value,
                }))
              }
            />
            {isInvalid && <FieldError>Please enter a file name</FieldError>}
          </Field>
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <DatePickerInput
              dateValue={
                fileInformation.start_date
                  ? new Date(fileInformation.start_date)
                  : undefined
              }
              updateDateValue={(newDate) => {
                if (newDate)
                  setFileInformation((prev) => ({
                    ...prev,
                    start_date: newDate,
                  }));
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Expiry Date</FieldLabel>
            <DatePickerInput
              dateValue={
                fileInformation.expiry_date
                  ? new Date(fileInformation.expiry_date)
                  : undefined
              }
              updateDateValue={(newDate) => {
                if (newDate)
                  setFileInformation((prev) => ({
                    ...prev,
                    expiry_date: newDate,
                  }));
              }}
            />
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel required>Document</FieldLabel>
          <FileDropzone
            name={fileInformation.file_type}
            file={fileInformation}
            addFile={(f) => {
              setFileInformation((prev) => ({
                ...prev,
                file: f,
                file_type: f.type,
                expiry_date: fileInformation.expiry_date,
                start_date: fileInformation.start_date,
                file_name: fileInformation.file_name,
                file_size: f.size,
              }));
            }}
            removeFile={(f) => setFileInformation(EMPTYFILEINFORMATION)}
          />
          {isInvalid && <FieldError>Please enter a file name</FieldError>}
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            onClick={() => {
              if (!fileInformation.file) {
                setIsInvalid(true);
                return;
              }
              if (!fileInformation.file_name) {
                setIsInvalid(true);
                return;
              }
              addFile(fileInformation.file_name, fileInformation);
              setOpen(false);
            }}
            type="submit"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
