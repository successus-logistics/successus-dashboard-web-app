import { toast } from "sonner";
import { Check, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { DriverDraftProvider, useDriverDraft } from "./driver-draft-context";
import FinacialFields from "./sections/financial-fields";
import LicenceFields from "./sections/license-fields";
import PersonalFields from "./sections/personal-fields";
import RTWFields from "./sections/rtw-fields";
import AdditionalFields from "./sections/additional-fields";

export default function ManualForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DriverDraftProvider>
      <ManualFormContent onOpenChange={onOpenChange} />
    </DriverDraftProvider>
  );
}

function ManualFormContent({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  // required sections
  const sections = {
    driver: {
      required: ["first_name", "last_name", "dob"],
    },

    licence_submission: {
      required: ["licence_number", "licence_country"],
    },

    legal: {
      isComplete: () => {
        return (
          (draft.legal.document_type &&
            (draft.legal.passport_number || draft.legal.share_code)) ||
          Object.keys(draft.legal.attachments).filter(
            (key) => key !== "additional",
          ).length > 0
        );
      },
    },

    finance: {
      isComplete: () => {
        const details = draft.driver;
        return (
          (details.bank_account_name &&
            details.bank_account_number &&
            details.bank_sort_code) ||
          details.utr ||
          details.ni_number ||
          details.vat
        );
      },
    },

    driver_notes: {
      isComplete: () => {
        return Object.values(draft.driver_notes).some((value) => {
          if (typeof value === "string") return value.length > 0;
          else if (typeof value === "object")
            return Object.values(value).length > 0;
        });
      },
    },
  } as const;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState("tab-personal");
  const { draft } = useDriverDraft();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const partiallyCompleteSections: (keyof typeof sections)[] = [];
    const incompleteSections: (keyof typeof sections)[] = [];
    Object.entries(sections).forEach(([key, val]) => {
      const progress = getProgress(key);
      if (progress == "partial") {
        partiallyCompleteSections.push(key);
      }
      if (progress == "incomplete") {
        incompleteSections.push(key);
      }
    });
    if (partiallyCompleteSections.length > 0) {
      toast.error(
        `Please complete the required fields in the "${partiallyCompleteSections}" section.`,
      );
      return;
    }

    // setIsSaving(true);

    const data = {};
    data["driver"] = draft["driver"];
    if (!incompleteSections.includes("licence_submission")) {
      data["licence_submission"] = draft["licence_submission"];
    }
    if (!incompleteSections.includes("legal")) {
      data["legal"] = draft["legal"];
    }
    for (const key of Object.keys(sections)) {
      if (!incompleteSections.includes(key)) {
        data[key] = draft[key];
      }
    }
    delete data.finance;
    try {
      const saved = await fetch("/api/drivers/", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (saved.ok) {
        const response = await saved.json();
        toast.success("Successfully added new driver");
        async function uploadDocuments(
          response: Record<string, unknown>,
          files: Record<string, File>,
          concurrency = 3,
        ) {
          const documents: Array<[string, any]> = [];

          function collect(value: unknown) {
            if (!value || typeof value !== "object") return;

            const obj = value as Record<string, unknown>;

            if ("upload_url" in obj) {
              documents.push([obj.file_name as string, obj]);
              return;
            }

            for (const child of Object.values(obj)) {
              collect(child);
            }
          }

          collect(response);

          let index = 0;

          async function worker() {
            while (index < documents.length) {
              const current = index++;

              const [key, document] = documents[current];
              await fetch(document.upload_url, {
                method: "PUT",
                body: files[key],
              });
            }
          }

          await Promise.all(
            Array.from(
              { length: Math.min(concurrency, documents.length) },
              worker,
            ),
          );
        }
        let attachments = {};
        const files = Object.values(draft).forEach((value) => {
          for (const [fileKey, fileValue] of Object.entries(
            value.attachments,
          )) {
            if (fileKey === "additional") {
              const files = Object.fromEntries(
                Object.entries(fileValue).map(([key, value]) => [
                  key,
                  value.file,
                ]),
              );
              attachments = { ...attachments, ...files };
            } else {
              attachments[fileKey] = fileValue.file;
            }
          }
        });
        await uploadDocuments(response, attachments, 3);
        onOpenChange(false);
        router.refresh();
      }
    } catch (Exception) {
      toast.error("Failed");
      console.log("Error", Exception);
    } finally {
      setIsSaving(false);
    }
  }

  function getTabState(section: keyof typeof sections) {
    const isActive = isCurrent(section);
    const state = getProgress(section);
    if (state === "complete") {
      return "complete";
    }
    if (isActive) return "active";
    return "incomplete";
  }

  function getProgress(section: keyof typeof sections) {
    const config = sections[section];

    if ("isComplete" in config) {
      return config.isComplete() ? "complete" : "incomplete";
    }

    const values = config.required.map((field) => draft[section][field]);

    const filled = values.filter(
      (value) => value !== null && value !== "" && value !== undefined,
    ).length;

    if (filled === 0) return "incomplete";
    if (filled === values.length) return "complete";
    return "partial";
  }

  function isCurrent(section: keyof typeof sections) {
    const keys = Object.keys(sections);
    let found = "";
    for (const key of keys) {
      if (getProgress(key) !== "complete") {
        found = key;
        break;
      }
    }
    if (section === found) {
      return true;
    }
    return false;
  }

  return (
    <>
      <DialogHeader className="border-b px-5 pt-2 pb-4">
        <DialogTitle>Add driver</DialogTitle>
        <DialogDescription>
          Create a complete driver record. Required identity fields are marked
          by an asterisk*.
        </DialogDescription>
      </DialogHeader>
      <form
        className="flex min-h-0 flex-col py-2"
        noValidate
        onSubmit={handleSubmit}
        ref={formRef}
      >
        <div className="grid max-h-[calc(92vh-12.5rem)] gap-4 overflow-y-auto bg-muted/20 p-4">
          <Tabs
            value={tab}
            onValueChange={(val) => {
              setTab(val);
            }}
            defaultValue="tab-personal"
          >
            <TabsList asChild className="h-10 bg-none! ">
              <div className="h-20! w-full items-center bg-none! px-10">
                <TabsTrigger
                  value="tab-personal"
                  className="flex-col h-10 justify-center"
                >
                  <DriverProgressTab
                    tabNum={1}
                    tabTitle="Personal"
                    tabStatus={getTabState("driver")}
                  />
                </TabsTrigger>
                <DriverProgressBar status={getProgress("driver")} />
                <TabsTrigger
                  value="tab-license"
                  className="flex-col h-10 bg-none! data-active:bg-none!"
                >
                  <DriverProgressTab
                    tabNum={2}
                    tabTitle="License"
                    tabStatus={getTabState("licence_submission")}
                  />
                </TabsTrigger>
                <DriverProgressBar status={getProgress("licence_submission")} />
                <TabsTrigger value="tab-rtw" className="flex-col h-10 bg-none!">
                  <DriverProgressTab
                    tabNum={3}
                    tabTitle="Right To Work"
                    tabStatus={getTabState("legal")}
                  />
                </TabsTrigger>
                <DriverProgressBar status={getProgress("legal")} />
                <TabsTrigger value="tab-tax" className="flex-col h-10 bg-none!">
                  <DriverProgressTab
                    tabNum={4}
                    tabTitle="Financial & Tax"
                    tabStatus={getTabState("finance")}
                  />
                </TabsTrigger>
                <DriverProgressBar status={getProgress("finance")} />
                <TabsTrigger
                  value="tab-additional"
                  className="flex-col h-10 bg-none!"
                >
                  <DriverProgressTab
                    tabNum={5}
                    tabTitle="Additional"
                    tabStatus={getTabState("driver_notes")}
                  />
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="tab-personal">
              <PersonalFields />
            </TabsContent>
            <TabsContent value="tab-license">
              <LicenceFields />
            </TabsContent>
            <TabsContent value="tab-rtw">
              <RTWFields />
            </TabsContent>
            <TabsContent value="tab-tax">
              <FinacialFields />
            </TabsContent>
            <TabsContent value="tab-additional">
              <AdditionalFields />
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="m-0 shrink-0 px-5">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isSaving}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Saving..." : "Add driver"}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
}

function DriverProgressTab({
  tabNum,
  tabTitle,
  tabStatus = "incomplete",
}: {
  tabNum: number;
  tabTitle: string;
  tabStatus: "complete" | "incomplete" | "active";
}) {
  return (
    <div className=" flex flex-col items-center">
      <div
        className={`rounded-full h-5 w-5 grid place-items-center aspect-square ${tabStatus === "complete" ? "bg-green-500 text-white" : tabStatus === "active" ? "bg-primary text-white" : "bg-white text-black"} `}
      >
        {tabStatus === "complete" ? <Check strokeWidth={3} /> : <>{tabNum}</>}
      </div>
      <div className="absolute top-full text-xs">{tabTitle}</div>
    </div>
  );
}

function DriverProgressBar({
  status,
}: {
  status: "complete" | "incomplete" | "partial";
}) {
  return (
    <div className={`h-0.5 w-full bg-accent relative`}>
      <div
        className={cn(
          "bg-primary absolute inset-0 w-0 transition-[width] duration-1000 ease-in-out",
          status === "complete" && "w-full",
          status === "partial" && "w-1/2",
        )}
      />
    </div>
  );
}
