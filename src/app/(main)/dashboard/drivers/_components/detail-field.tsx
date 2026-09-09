import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Check, Copy, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function DetialField({
  field,
  value,
  disabled = true,
  required = false,
}: {
  field: string;
  value: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  function handleCopy() {
    const text = inputRef.current?.value;
    navigator.clipboard.writeText(text ?? "").then(
      () => {
        toast.custom(
          (id) => (
            <Card className="bg-accent shadow-2xl flex-row gap-2 items-center p-2 translate-x-1/2">
              <div className="rounded-full bg-green-900 p-1.5">
                <Check strokeWidth={3} size={20} className="text-white" />
              </div>
              Copied to clipboard
            </Card>
          ),
          { position: "top-center" },
        );
      },
      () => {
        toast.error("something went wrong");
      },
    );
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length);
    }
  }, [isEditing]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <FieldLabel required={required} className="tracking-wider ">
          {field}
        </FieldLabel>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button onClick={handleCopy} variant={"ghost"} size={"xs"}>
              <Copy size={12} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Copy</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="relative">
        <Tooltip delayDuration={300}>
          <TooltipTrigger className="w-full">
            <Input
              ref={inputRef}
              readOnly={!isEditing}
              type="text"
              defaultValue={value}
              className="relative p-5 w-full h-10 border-blue-300/50 focus:bg-accent/80 read-only:hover:opacity-50"
              placeholder={field}
            />
          </TooltipTrigger>
          <TooltipContent hidden={isEditing}>
            <p>Click the pencil to edit</p>
          </TooltipContent>
        </Tooltip>
        {!isEditing ? (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button variant={"destructive"} onClick={toggleEdit} size={"sm"}>
              <Pencil />
            </Button>
          </div>
        ) : (
          <div className="absolute right-1 top-1/2 -translate-y-1/2">
            <Button
              variant={"outline"}
              className="bg-green-300"
              onClick={toggleEdit}
              size={"sm"}
            >
              <Check />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
