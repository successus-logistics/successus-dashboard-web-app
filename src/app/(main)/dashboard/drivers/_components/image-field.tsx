import { Attachment, AttachmentAction, AttachmentActions, AttachmentContent, AttachmentDescription, AttachmentMedia, AttachmentTitle, AttachmentTrigger } from "@/components/ui/attachment";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import FileDropzone from "@/components/ui/file-dropzone";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CirclePlus, ExternalLink, XIcon } from "lucide-react";
import Image from "next/image";

export default function ImageField({ field, image }: { field: string; image?: string }) {
  if (image) {
    return (
      <Attachment orientation={"vertical"} className="w-56" size={"default"}>
        <AttachmentMedia variant={"image"}>
          <Image className="z-0 object-cover" fill src={image} alt={field} />
        </AttachmentMedia>
        <AttachmentContent>
          <AttachmentTitle>{field}</AttachmentTitle>
          <AttachmentDescription>PNG &#8226; 20mb</AttachmentDescription>
        </AttachmentContent>
        <AttachmentActions>
          <AttachmentAction aria-label={`Remove ${field}`}>
            <XIcon />
          </AttachmentAction>
        </AttachmentActions>
        <AttachmentTrigger asChild>
          <a
            href={image}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${field}`}
          />
        </AttachmentTrigger>
      </Attachment>
    )
  }
  return (
    <Attachment size="xs" >
      <AttachmentMedia>
        <CirclePlus />
      </AttachmentMedia>
      <AttachmentContent>
        <Input type="file" className="opacity-0 absolute inset-0" />new attachment
      </AttachmentContent>
    </Attachment>
  )
}
