import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Check, Copy, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function DetialField({
  field,
  value,
  disabled = true,
}: {
  field: string;
  value: string;
  disabled: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const toggleEdit = () => {
    setIsEditing(prev => !prev)
  }

  function handleCopy() {
    const text = inputRef.current?.value
    navigator.clipboard.writeText(text ?? "").then(
      () => {
        toast.custom((id) => (
          <Card className="bg-accent shadow-2xl flex-row gap-2 items-center p-2">
            <div className="rounded-full bg-green-900 p-1.5">
              <Check strokeWidth={3} size={20} className="text-white" />
            </div>
            Copied to clipboard
          </Card>
        ), { position: "top-center", }
        )
      },
      () => {
        toast.error("something went wrong")
      }
    )
  }

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(0, inputRef.current.value.length,)
    }

  }, [isEditing])

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <h2 className="tracking-wider ">
          {field}
        </h2>
        <Button onClick={handleCopy} variant={"ghost"} size={"xs"}>
          <Copy size={12} />
        </Button>
      </div>
      <div className="relative">
        <Input ref={inputRef} title="click edit" disabled={!isEditing} type="text" defaultValue={value} className="relative p-5 h-10 border-blue-300/50 focus:bg-accent/80 disabled:bg-gray-300" placeholder={field} />
        <Button variant={"destructive"} className="absolute right-1 top-1/2 -translate-y-1/2" onClick={toggleEdit}>
          <Pencil />
        </Button>
      </div>
    </div>
  );
}
