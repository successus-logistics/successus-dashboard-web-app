import { Button } from "@/components/ui/button";
import { DriverRecord } from "../../types";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DriverField } from "../../_components/form/field";
import { DetialField } from "../../_components/detail-field";
import ImageField from "../../_components/image-field";
import { Field, FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Check,
  CopyIcon,
  File,
  Info,
  PlusCircle,
  Save,
  Signature,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentTrigger,
} from "@/components/ui/attachment";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

export default function Contracts({
  driverDetails,
  disabled = true,
}: {
  driverDetails: DriverRecord;
  disabled?: boolean;
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="font-semibold ">
          Contracts <Badge variant={"destructive"}>needs review</Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          View the status of driver contracts
        </CardDescription>
        <Separator />
      </CardHeader>
      <Card className="h-full scrollbar-none p-2! grid">
        <Card className="grid grid-rows-[auto_auto_1fr_auto] h-full">
          <CardContent className="grid grid-cols-[1fr_1fr] px-3">
            <h2 className="">Item</h2>
            <div className="grid grid-cols-3">
              <h2>Active</h2>
              <h2>Date</h2>
              <h2>Action</h2>
            </div>
          </CardContent>
          <CardContent className="relative">
            <ScrollArea className="h-56">
              <AttachmentGroup className="px-3 w-full grid gap-3">
                <Dialog>
                  <Attachment
                    orientation={"horizontal"}
                    className="w-full border-green-300  grid grid-cols-[1fr_1fr]"
                  >
                    <div className="flex gap-1 items-center">
                      <AttachmentActions>
                        <AttachmentAction asChild>
                          <Checkbox className="bg-accent hover:bg-accent"></Checkbox>
                        </AttachmentAction>
                      </AttachmentActions>
                      <AttachmentMedia>
                        <Signature />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle className="flex gap-1 items-center">
                          Health & Safety{" "}
                          <Check color="green" size={16} strokeWidth={4} />
                        </AttachmentTitle>
                        <AttachmentDescription className="flex gap-1 items-center">
                          Read &#8226; Signed on Mon, 07 Sep 2026
                        </AttachmentDescription>
                      </AttachmentContent>
                    </div>
                    <div className="grid grid-cols-3">
                      <Badge>Active</Badge>
                      <div>2026-08-10</div>
                      <AttachmentActions className="justify-self-end">
                        <AttachmentAction
                          aria-label="Remove research-summary.pdf"
                          variant={"destructive"}
                          className="w-full p-2"
                        >
                          Delete
                        </AttachmentAction>
                      </AttachmentActions>
                    </div>
                    <DialogTrigger asChild>
                      <AttachmentTrigger aria-label="Preview research-summary.pdf" />
                    </DialogTrigger>
                  </Attachment>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>research-summary.pdf</DialogTitle>
                      <DialogDescription>
                        The attachment trigger fills the card and opens the
                        dialog, while the actions stay independently clickable
                        above it.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <Attachment className="w-full border-green-300  grid grid-cols-[1fr_1fr]">
                    <div className="flex gap-1 items-center">
                      <AttachmentActions>
                        <AttachmentAction asChild>
                          <Checkbox className="bg-accent hover:bg-accent"></Checkbox>
                        </AttachmentAction>
                      </AttachmentActions>
                      <AttachmentMedia>
                        <Signature />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle className="flex gap-1 items-center">
                          Health & Safety{" "}
                          <Check color="green" size={16} strokeWidth={4} />
                        </AttachmentTitle>
                        <AttachmentDescription className="flex gap-1 items-center">
                          Read &#8226; Signed on Mon, 07 Sep 2026
                        </AttachmentDescription>
                      </AttachmentContent>
                    </div>
                    <div className="grid grid-cols-3">
                      <Badge>Active</Badge>
                      <div>2026-08-10</div>
                      <AttachmentActions className="justify-self-end">
                        <AttachmentAction
                          aria-label="Remove research-summary.pdf"
                          variant={"destructive"}
                          className="w-full p-2"
                        >
                          Delete
                        </AttachmentAction>
                      </AttachmentActions>
                    </div>
                    <DialogTrigger asChild>
                      <AttachmentTrigger aria-label="Preview research-summary.pdf" />
                    </DialogTrigger>
                  </Attachment>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>research-summary.pdf</DialogTitle>
                      <DialogDescription>
                        The attachment trigger fills the card and opens the
                        dialog, while the actions stay independently clickable
                        above it.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <Attachment className="w-full border-green-300 grid grid-cols-[1fr_1fr]">
                    <div className="flex gap-1 items-center">
                      <AttachmentMedia>
                        <Signature />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle className="flex gap-1 items-center">
                          Health & Safety{" "}
                          <Check color="green" size={16} strokeWidth={4} />
                        </AttachmentTitle>
                        <AttachmentDescription className="flex gap-1 items-center">
                          Read &#8226; Signed on Mon, 07 Sep 2026
                        </AttachmentDescription>
                      </AttachmentContent>
                    </div>
                    <div className="grid grid-cols-3">
                      <Badge>Active</Badge>
                      <div>2026-08-10</div>
                      <AttachmentActions className="justify-self-end">
                        <AttachmentAction
                          aria-label="Remove research-summary.pdf"
                          variant={"destructive"}
                          className="w-full p-2"
                        >
                          Delete
                        </AttachmentAction>
                      </AttachmentActions>
                    </div>
                    <DialogTrigger asChild>
                      <AttachmentTrigger aria-label="Preview research-summary.pdf" />
                    </DialogTrigger>
                  </Attachment>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>research-summary.pdf</DialogTitle>
                      <DialogDescription>
                        The attachment trigger fills the card and opens the
                        dialog, while the actions stay independently clickable
                        above it.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Dialog>
                  <Attachment className="w-full border-green-300 bg-green-300/5 grid grid-cols-[1fr_1fr]">
                    <div className="flex gap-1 items-center">
                      <AttachmentMedia>
                        <Signature />
                      </AttachmentMedia>
                      <AttachmentContent>
                        <AttachmentTitle className="flex gap-1 items-center">
                          Health & Safety{" "}
                          <Check color="green" size={16} strokeWidth={4} />
                        </AttachmentTitle>
                        <AttachmentDescription className="flex gap-1 items-center">
                          Read &#8226; Signed on Mon, 07 Sep 2026
                        </AttachmentDescription>
                      </AttachmentContent>
                    </div>
                    <div className="grid grid-cols-3">
                      <Badge>Active</Badge>
                      <div>2026-08-10</div>
                      <AttachmentActions className="justify-self-end">
                        <AttachmentAction
                          aria-label="Remove research-summary.pdf"
                          variant={"destructive"}
                          className="w-full p-2"
                        >
                          Delete
                        </AttachmentAction>
                      </AttachmentActions>
                    </div>
                    <DialogTrigger asChild>
                      <AttachmentTrigger aria-label="Preview research-summary.pdf" />
                    </DialogTrigger>
                  </Attachment>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>research-summary.pdf</DialogTitle>
                      <DialogDescription>
                        The attachment trigger fills the card and opens the
                        dialog, while the actions stay independently clickable
                        above it.
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </AttachmentGroup>
            </ScrollArea>
            <Button variant={"outline"} className="absolute bottom-00 right-10">
              <PlusCircle />
            </Button>
          </CardContent>
          <CardFooter>
            <Button
              disabled
              variant={"destructive"}
              size={"lg"}
              className="h-10"
            >
              <Save />
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </Card>
    </>
  );
}
