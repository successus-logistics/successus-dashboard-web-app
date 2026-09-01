"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { DriverCreateType, PartialDriverRecord } from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManualForm from "./form/manual-form";
import EmailForm from "./form/email-form";
import { FilePen, Mail } from "lucide-react";

interface DriverDialogProps {
  driver: DriverCreateType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (driver: PartialDriverRecord) => Promise<boolean>;
}

function formatAuditDate(value: string) {
  if (!value) {
    return "Not recorded";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DriverProfileDialog({ open, onOpenChange }: DriverDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto scrollbar-none p-0 sm:max-w-2xl">
        <Tabs defaultValue="manual-add" className="px-4 pt-2">
          <TabsList>
            <TabsTrigger value="manual-add">
              <FilePen />
              Manual
            </TabsTrigger>
            <TabsTrigger value="email-add">
              <Mail />
              Email
            </TabsTrigger>
          </TabsList>
          <TabsContent value="manual-add">
            <ManualForm />
          </TabsContent>
          <TabsContent value="email-add">
            <EmailForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
