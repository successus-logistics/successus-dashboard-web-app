"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { Card } from "./card";
export default function CopyItem({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  function handleCopy() {
    navigator.clipboard.writeText(value ?? "").then(
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
  return (
    <div className="flex items-center gap-1">
      {children}
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
  );
}
