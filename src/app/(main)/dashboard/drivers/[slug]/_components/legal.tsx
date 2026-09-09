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
  ArrowUpWideNarrow,
  Ellipsis,
  Info,
  Plus,
  Save,
  TriangleAlert,
} from "lucide-react";
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
import CopyItem from "@/components/ui/copy-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Legal({
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
          Legal <Badge variant={"destructive"}>needs review</Badge>
        </CardTitle>
        <CardDescription className="text-sm">
          Right to Work details
        </CardDescription>
        <Separator />
      </CardHeader>
      <Card className="col-start-2 h-full scrollbar-none p-2! grid ">
        <Tabs defaultValue={"passport"}>
          <TabsList variant={"line"} className="mb-1">
            <TabsTrigger value="passport">Passport</TabsTrigger>
            <TabsTrigger value="document">Documents</TabsTrigger>
            <TabsTrigger value="dbs">DBS</TabsTrigger>
            <TabsTrigger value="address">Address</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="passport" className="grid h-full">
            <Card className="grid grid-rows-[1fr_auto] grid-cols-[1fr_2fr] h-full">
              <CardContent className="grid gap-3">
                <div className="gap-5  *:gap-3 flex-col grid  grid-cols-1">
                  <CardTitle>Details</CardTitle>
                  <dl className="grid grid-cols-2 items-center">
                    <dt className="dark:text-gray-300 font-light">Status</dt>
                    <dd>
                      <Badge className="bg-green-800 text-green-500 dark:text-green-300">
                        Approved
                      </Badge>
                    </dd>
                  </dl>
                  <dl className="grid grid-cols-2 items-center">
                    <dt className="dark:text-gray-300 font-light">
                      Passport No.
                    </dt>
                    <dd>
                      <CopyItem value="120941">120941</CopyItem>
                    </dd>
                  </dl>
                  <dl className="grid grid-cols-2 items-center">
                    <dt className="dark:text-gray-300 font-light">
                      Reference No.
                    </dt>
                    <dd>
                      <CopyItem value="120941">120941</CopyItem>
                    </dd>
                  </dl>
                  <dl className="grid grid-cols-2 items-center">
                    <dt className="dark:text-gray-300 font-light">
                      Valid From
                    </dt>
                    <dd>2025-10-20</dd>
                  </dl>
                  <dl className="grid grid-cols-2 items-center">
                    <dt className="dark:text-gray-300 font-light">Expires</dt>
                    <dd>2025-10-20</dd>
                  </dl>
                </div>

                <div className="col-span-full flex flex-col gap-2">
                  <FieldLabel>Attachments</FieldLabel>
                  <div className="flex flex-col gap-2 col-span-full">
                    <ImageField
                      field="Passport"
                      image={
                        "https://images.pexels.com/photos/27347529/pexels-photo-27347529.jpeg"
                      }
                    />
                    <ImageField field="Passport" />
                  </div>
                </div>
              </CardContent>
              <CardContent>
                <div className="w-full grid  gap-5">
                  <CardTitle>Events</CardTitle>
                  <Item
                    variant={"outline"}
                    className="border-destructive bg-destructive/10 col-span-full "
                  >
                    <ItemMedia variant={"icon"}>
                      <TriangleAlert className="text-destructive" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>Pending Approval</ItemTitle>
                      <ItemDescription>
                        Please verify the details and approve or reject the item
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button variant={"destructive"}>Reject</Button>
                      <Button variant={"outline"}>Approve</Button>
                    </ItemActions>
                  </Item>

                  <ScrollArea className="max-h-52 overflow-y-auto border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody className="overflow-scroll *:hover:bg-accent">
                        <TableRow>
                          <TableCell>Early expiration</TableCell>
                          <TableCell>2026-08-09</TableCell>
                          <TableCell>2026-08-19</TableCell>
                          <TableCell className="flex gap-1 items-center">
                            <Badge variant={"destructive"}>action needed</Badge>
                            <Button variant={"ghost"} size={"icon-xs"}>
                              <Ellipsis />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Early expiration </TableCell>
                          <TableCell>2026-08-09</TableCell>
                          <TableCell>2026-08-19</TableCell>
                          <TableCell className="flex gap-1 items-center">
                            <Badge variant={"destructive"}>action needed</Badge>
                            <Button variant={"ghost"} size={"icon-xs"}>
                              <Ellipsis />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </div>
              </CardContent>
              <CardFooter className="col-span-full flex gap-3">
                <Button
                  disabled
                  variant={"destructive"}
                  size={"lg"}
                  className="h-10"
                >
                  <Save />
                  Save Changes
                </Button>
                <Button variant={"outline"} size={"lg"} className="h-10">
                  <Plus />
                  New Submission
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </Card>
    </>
  );
}
