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
import { FieldLabel } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info, Save, TriangleAlert } from "lucide-react";
import { AttachmentGroup } from "@/components/ui/attachment";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Finance({
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
          Tax & Finance <Badge variant={"destructive"}>needs review</Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Edit Tax and financial Details
        </CardDescription>
        <Separator />
      </CardHeader>
      <Card className="h-full scrollbar-none p-2! grid">
        <Tabs defaultValue={"payment"}>
          <TabsList defaultValue={"payment"} variant={"line"}>
            <TabsTrigger value="payment">Bank</TabsTrigger>
            <TabsTrigger value="tax">Tax</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>
          <TabsContent className="grid h-full auto-rows-min" value="payment">
            <Card className="grid grid-rows-[auto_1fr_auto] h-full">
              <CardContent className="grid grid-cols-2 gap-5">
                <DetialField
                  field="Card Holder Name"
                  value={driverDetails.bank_details}
                />
                <DetialField
                  field="Account Number"
                  value={driverDetails.bank_details}
                />
                <DetialField
                  field="Sort-Code"
                  value={driverDetails.bank_details}
                />
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
          </TabsContent>
          <TabsContent value="tax">
            <Card className="grid grid-rows-[auto_1fr_auto] h-full">
              <CardContent className="grid grid-cols-2 gap-5">
                <DetialField field="UTR" value={driverDetails.bank_details} />
                <DetialField
                  field="VAT Number"
                  value={driverDetails.bank_details}
                />
                <DetialField
                  field="NI Number"
                  value={driverDetails.bank_details}
                />
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
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
