"use client";

import * as React from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DriverCreateType,
  driverFactory,
  type DriverRecord,
  PartialDriverRecord,
} from "../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import PersonalFields from "./form/personal-fields";
import LicenseFields from "./form/license-fields";

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

export function DriverProfileDialog({
  driver,
  open,
  onOpenChange,
  onSave,
}: DriverDialogProps) {
  const [draft, setDraft] = React.useState<PartialDriverRecord>(
    driverFactory(driver),
  );
  const [isSaving, setIsSaving] = React.useState(false);
  const [tab, setTab] = React.useState("");
  const [sectionCompletion, setSectionCompletion] = React.useState("");

  function update<K extends keyof DriverRecord>(
    field: K,
    value: DriverRecord[K],
  ) {
    setDraft((current) => ({ ...current, [field]: value }));
  }
  console.log("draft:", draft);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    const requiredValues = Object.entries(sections).some(([key, val]) => {
      console.log("key is", key);
      return getProgress(key) !== "complete";
    });
    if (requiredValues) {
      toast.error(
        "Please complete the first name, last name, phone_number and email fields.",
      );
      return;
    }

    setIsSaving(true);

    try {
      const saved = await onSave({
        ...draft,
        created_at: new Date().toISOString(),
      });

      if (saved) {
        onOpenChange(false);
      }
    } finally {
      setIsSaving(false);
    }
  }
  const sections = {
    personal: ["first_name", "last_name", "dob"],
    license: ["license_number", "license_expiry"],
  } as const;

  function getProgress(section: keyof typeof sections) {
    const values = sections[section].map((field) => draft[field]);
    const filled = values.filter(
      (value) => value !== null && value !== "" && value !== undefined,
    ).length;
    console.log(values, section);
    if (filled === 0) return "incomplete";
    if (filled === sections[section].length) return "complete";
    return "current";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="border-b px-5 pt-5 pb-4">
          <DialogTitle>Add driver</DialogTitle>
          <DialogDescription>
            Create a complete driver record. Required identity fields are marked
            by the browser.
          </DialogDescription>
        </DialogHeader>

        <form
          className="flex min-h-0 flex-col"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="grid max-h-[calc(92vh-9.5rem)] gap-4 overflow-y-auto bg-muted/20 p-4">
            <Tabs
              onValueChange={(val) => {
                setTab(val);
                console.log("tab is on", val);
              }}
              defaultValue="tab-personal"
            >
              <TabsList asChild className="h-10 bg-none! ">
                <div className="h-20! w-full items-center bg-none! px-10">
                  <TabsTrigger
                    value="tab-personal"
                    className="flex-col h-10 bg-none! justify-center"
                  >
                    <DriverProgressTab
                      tabNum={1}
                      tabTitle="Personal"
                      tabStatus={getProgress("personal")}
                    />
                  </TabsTrigger>
                  <DriverProgressBar status={getProgress("personal")} />
                  <TabsTrigger
                    value="tab-license"
                    className="flex-col h-10 bg-none! data-active:bg-none!"
                  >
                    <DriverProgressTab
                      tabNum={2}
                      tabTitle="License"
                      tabStatus={getProgress("license")}
                    />
                  </TabsTrigger>
                  <DriverProgressBar status={getProgress("license")} />
                  <TabsTrigger
                    value="tab-rtw"
                    className="flex-col h-10 bg-none!"
                  >
                    <DriverProgressTab
                      tabNum={3}
                      tabTitle="Right To Work"
                      tabStatus="incomplete"
                    />
                  </TabsTrigger>
                  <DriverProgressBar status="incomplete" />
                  <TabsTrigger
                    value="tab-emergency"
                    className="flex-col h-10 bg-none!"
                  >
                    <DriverProgressTab
                      tabNum={4}
                      tabTitle="Emergency"
                      tabStatus="incomplete"
                    />
                  </TabsTrigger>
                  <DriverProgressBar status="incomplete" />
                  <TabsTrigger
                    value="tab-operational"
                    className="flex-col h-10 bg-none!"
                  >
                    <DriverProgressTab
                      tabNum={5}
                      tabTitle="Operational"
                      tabStatus="incomplete"
                    />
                  </TabsTrigger>
                </div>
              </TabsList>
              <TabsContent value="tab-personal">
                <PersonalFields driver={draft} onUpdate={update} />
              </TabsContent>
              <TabsContent value="tab-license">
                <LicenseFields driver={draft} onUpdate={update} />
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="m-0 shrink-0 px-5">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Add driver"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DriverProgressTab({
  tabNum,
  tabTitle,
  tabStatus = "incomplete",
}: {
  tabNum: number;
  tabTitle: string;
  tabStatus: "complete" | "incomplete";
}) {
  return (
    <div className=" flex flex-col items-center">
      <div
        className={`rounded-full h-5 w-5 aspect-square ${tabStatus === "complete" ? "bg-green-500 text-white" : "bg-white text-black"} `}
      >
        {tabNum}
      </div>
      <div className="absolute top-full text-xs">{tabTitle}</div>
    </div>
  );
}

function DriverProgressBar({
  status,
}: {
  status: "complete" | "incomplete" | "current";
}) {
  return (
    <div className={`h-0.5 w-full bg-accent relative`}>
      <div
        className={cn(
          "bg-primary absolute inset-0 w-0 transition-[width] duration-1000 ease-in-out",
          status === "complete" && "w-full",
          status === "current" && "w-1/2",
        )}
      />
    </div>
  );
}
