import { cn } from "@/lib/utils";
import PersonalFields from "./sections/personal-fields";
import LicenceFields from "./sections/license-fields";
import RTWFields from "./sections/rtw-fields";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { driverFactory, DriverRecord, PartialDriverRecord } from "../../types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import FinacialFields from "./sections/financial-fields";

export default function ManualForm({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void;
}) {
  // required sections
  const sections = {
    personal: ["first_name", "last_name", "dob"],
    license: [
      "licence_number",
      "licence_country",
      "licence_issue_date",
      "licence_expiry_date",
      "licence_front_image",
      "licence_back_image",
      "points",
      "categories",
    ],
    rtw: ["passport no"],
  } as const;
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [tab, setTab] = useState("tab-personal");
  const [draft, setDraft] = useState<DriverRecord>(driverFactory());
  const formRef = useRef<HTMLFormElement>(null);
  console.log("draft", draft);

  function update(pair: unknown) {
    setDraft((current) => ({ ...current, pair }));
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const incompleteSections: (typeof sections)[keyof typeof sections][] = [];
    const requiredValues = Object.entries(sections).some(([key, val]) => {
      if (getProgress(key) == "partial") {
        incompleteSections.push(key);
        return true;
      }
    });
    if (requiredValues) {
      toast.error(
        `Please complete the required fields in the "${incompleteSections}" section.`,
      );
      return;
    }

    setIsSaving(true);

    if (!formRef.current) return;

    const vals = {};
    for (const [key, value] of Object.entries(draft)) {
      if (value) {
        vals[key] = value;
      }
    }

    try {
      const saved = await fetch("/api/drivers/", {
        method: "POST",
        body: JSON.stringify({ driver: vals }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (saved.ok) {
        const data = await saved.json();
        toast.success("Successfully added new driver", data);
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
    const values = sections[section].map((field) => draft[field]);
    const filled = values.filter(
      (value) => value !== null && value !== "" && value !== undefined,
    ).length;

    if (filled === 0) return "incomplete";
    if (filled === sections[section].length) return "complete";
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
                    tabStatus={getTabState("personal")}
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
                    tabStatus={getTabState("license")}
                  />
                </TabsTrigger>
                <DriverProgressBar status={getProgress("license")} />
                <TabsTrigger value="tab-rtw" className="flex-col h-10 bg-none!">
                  <DriverProgressTab
                    tabNum={3}
                    tabTitle="Right To Work"
                    tabStatus={getTabState("rtw")}
                  />
                </TabsTrigger>
                <DriverProgressBar status="incomplete" />
                <TabsTrigger value="tab-tax" className="flex-col h-10 bg-none!">
                  <DriverProgressTab
                    tabNum={4}
                    tabTitle="Financial & Tax"
                    tabStatus="incomplete"
                  />
                </TabsTrigger>
              </div>
            </TabsList>
            <TabsContent value="tab-personal">
              <PersonalFields driver={draft.driver} onUpdate={update} />
            </TabsContent>
            <TabsContent value="tab-license">
              <LicenceFields licence={draft} onUpdate={update} />
            </TabsContent>
            <TabsContent value="tab-rtw">
              <RTWFields driver={draft} onUpdate={update} />
            </TabsContent>
            <TabsContent value="tab-tax">
              <FinacialFields driver={draft} onUpdate={update} />
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
