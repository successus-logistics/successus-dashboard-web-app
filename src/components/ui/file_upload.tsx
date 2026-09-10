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
import { Field, FieldGroup, FieldLabel } from "./field";
import { DatePickerInput } from "./date-picker";
import { Input } from "./input";
import { useState } from "react";
import FileDropzone from "./file-dropzone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select";
import { file } from "zod";

const fileType = {
  image: ".png, webp, .jpg, .jpeg",
  document: ".pdf, .docx, .doc",
} as const;

type FileInformationType = {
  file_name: string;
  type: string;
  start_date: string | undefined;
  expiry_date: string | undefined;
  file: File | undefined
}

export default function FileUpload({ addFile }: { addFile: (name: string, file: File | undefined) => void; }) {
  const [open, setOpen] = useState(false)
  const [fileSelected, setFileSelected] = useState<File | undefined>(undefined);
  const [fileName, setFileName] = useState("")
  const [type, setType] = useState<keyof typeof fileType>("image");
  const [startDate, setStartDate] = useState<string | undefined>();
  const [expiryDate, setExpiryDate] = useState<string | undefined>();
  const [fileInformation, setFileInformation] = useState<FileInformationType>({
    file_name: "",
    type: "",
    start_date: undefined,
    expiry_date: undefined,
    file: undefined,
  })
  console.log(fileInformation)
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <PlusCircle />
          Add File
        </Button>
      </DialogTrigger>
      <DialogContent
        className="min-w-xl"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}>
        <DialogHeader>
          <DialogTitle>New File Upload</DialogTitle>
          <DialogDescription>
            Please fill out the following fields to upload your file
          </DialogDescription>
        </DialogHeader>
        <FieldGroup className="grid grid-cols-2">
          <Field>
            <FieldLabel>File Name</FieldLabel>
            <Input name="file_name" placeholder="file name"
              onChange={(e) =>
                setFileInformation((prev) => ({
                  ...prev,
                  file_name: e.target.value,
                }))
              }
            />
          </Field>
          <Field>
            <FieldLabel>File Type</FieldLabel>
            <Select name="file_type" onValueChange={(value: keyof typeof fileType) => setFileInformation(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="select file type" />
              </SelectTrigger>
              <SelectContent position="popper">
                {Object.entries(fileType).map(([key]) => (
                  <SelectItem key={key} value={key}>{key}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Start Date</FieldLabel>
            <DatePickerInput
              dateValue={fileInformation.start_date ? new Date(fileInformation.start_date) : undefined}
              updateDateValue={(newDate) => {
                if (newDate) setFileInformation(prev => ({ ...prev, start_date: newDate }));
              }}
            />
          </Field>
          <Field>
            <FieldLabel>Expiry Date</FieldLabel>
            <DatePickerInput
              dateValue={fileInformation.expiry_date ? new Date(fileInformation.expiry_date) : undefined}
              updateDateValue={(newDate) => {
                if (newDate) setFileInformation(prev => ({ ...prev, expiry_date: newDate }));
              }}
            />
          </Field>
        </FieldGroup>
        <Field>
          <FieldLabel>Document</FieldLabel>
          <FileDropzone
            allowed_ext={fileType[type]}
            name={type}
            file={fileSelected}
            onChange={(f) => {
              setFileInformation(prev => ({ ...prev, file: f }))
            }}
          />
        </Field>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={() => {
            addFile(fileInformation.file_name, fileInformation)
            setOpen(false)
          }} type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
