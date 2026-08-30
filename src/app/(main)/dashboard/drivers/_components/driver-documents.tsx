import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrickWallShield } from "lucide-react";
import { DetialField } from "./detail-field";
import { Badge } from "@/components/ui/badge";

export default function DriverDocuments() {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle>Sensitive Data</CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <Tabs defaultValue="tab-bank" className="h-full">
          <TabsList>
            <TabsTrigger value="tab-bank">Bank Details</TabsTrigger>
            <TabsTrigger value="tab-evidence">Evidence</TabsTrigger>
            <TabsTrigger value="tab-background">Background</TabsTrigger>
          </TabsList>
          <TabsContent value="tab-bank" className="h-full">
            <BankDetails />
          </TabsContent>
          <TabsContent value="tab-evidence" className="h-full">
            <Evidence />
          </TabsContent>
          <TabsContent value="tab-background" className="h-full">
            <BankDetails />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function BankDetails() {
  return (
    <div className="grid gap-2 h-full">
      <div className="p-1 h-fit flex gap-1 items-center ring-2 ring-red-500 bg-red-500/10 rounded-lg">
        <BrickWallShield className="text-destructive" /> This action will be
        logged!
      </div>
      <div className="flex flex-col justify-between h-full">
        <DetialField field="Account Number" value="312872194" />
        <DetialField field="Account Number" value="312872194" />
        <DetialField field="Account Number" value="312872194" />
      </div>
    </div>
  );
}

function Evidence() {
  return (
    <div className="grid gap-5">
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Driver Licence</CardTitle>
          <CardDescription>Not Yet Uploaded</CardDescription>
        </div>
        <div>
          <Badge variant={"outline"}>Pending</Badge>
        </div>
      </div>
      <Separator />
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Right To Work</CardTitle>
          <CardDescription>Not Yet Uploaded</CardDescription>
        </div>
        <div>
          <Badge variant={"outline"}>Pending</Badge>
        </div>
      </div>
    </div>
  );
}
