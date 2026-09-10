import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ComponentProps } from "react";
import { CirclePlus, XIcon, Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

type AttachmentProps = ComponentProps<typeof Attachment> & {
  field: string;
  image?: string | File;
  deleteAction: () => void;
};

function getImgPreview(file: File) {
  return URL.createObjectURL(file);
}

export default function ImageField({
  field,
  image,
  deleteAction,
  ...props
}: AttachmentProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(image);
  let src = file;
  if (src instanceof File) {
    src = getImgPreview(src);
  }
  if (image) {
    return (
      <>
        <Attachment
          orientation={"horizontal"}
          className="w-56 group"
          size={"default"}
          {...props}
        >
          <AttachmentMedia
            className="group-hover:scale-105 transition-transform duration-300"
            variant={"image"}
          >
            <Image
              className="z-0 object-cover group-hover:scale-105 transition-transform duration-300"
              fill
              src={src ?? "#"}
              alt={field}
            />
          </AttachmentMedia>
          <AttachmentContent>
            <AttachmentTitle>{field}</AttachmentTitle>
            <AttachmentDescription>PNG &#8226; 20mb</AttachmentDescription>
          </AttachmentContent>
          <AttachmentActions onClick={() => setOpen(true)}>
            <AttachmentAction aria-label={`Remove ${field}`}>
              <XIcon />
            </AttachmentAction>
          </AttachmentActions>
          <AttachmentTrigger asChild>
            <a
              href={src ?? "#"}
              target="_blank"
              rel="noreferrer"
              aria-label={`Open ${field}`}
            />
          </AttachmentTrigger>
        </Attachment>
        {open && (
          <AlertDialogDestructive
            open={open}
            closeAlert={() => setOpen(false)}
            deleteAction={() => deleteAction()}
          />
        )}
      </>
    );
  }
  return (
    <Attachment state="error" className="w-56" {...props}>
      <AttachmentMedia>
        <CirclePlus />
      </AttachmentMedia>
      <AttachmentContent>
        <Input
          type="file"
          className="opacity-0 h-full absolute inset-0 cursor-pointer"
        />
        {field}
      </AttachmentContent>
    </Attachment>
  );
}

export function AlertDialogDestructive({
  open,
  closeAlert,
  deleteAction,
}: {
  open: boolean;
  closeAlert: () => void;
  deleteAction: () => void;
}) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete File?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will permanently delete this item.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeAlert} variant="outline">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={deleteAction} variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
