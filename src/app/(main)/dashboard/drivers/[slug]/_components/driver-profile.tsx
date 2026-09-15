"use client";
import DriverDetials from "./personal";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookUser,
  FileSearch,
  IdCard,
  Landmark,
  Signature,
  Trash,
  User,
} from "lucide-react";
import DriverContracts from "./driver-contracts";
import DriverDocuments from "./driver-documents";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DriverRecord } from "../../types";
import { useState } from "react";
import Licence from "./licence";
import Legal from "./legal";
import { Badge } from "@/components/ui/badge";
import Finance from "./finance";
import Contracts from "./contracts";
import BannerHeader from "./banner-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SidePanel from "./side-panel";

export default function DriverProfile({
  driverDetails,
}: {
  driverDetails: DriverRecord;
}) {
  const [isEditing, setIsEditing] = useState(false);
  // TODO: Add a summary of important information.
  // Maybe a ui for commonly accessed information plus important/expiring information
  // Could be added as a new card component which in turn will reduce the width of
  // the main fields (might make it more visually appealing)
  return (
    <div className="grid grid-rows-[auto_1fr] gap-5 h-full scroll-smooth">
      <div defaultValue="personal" className="grid grid-rows-2 gap-5">
        <Card
          defaultValue="personal"
          className="bg-transparent ring-0 relative flex flex-col justify-start *:self-start *:justify-self-start h-full row-span-full"
        >
          <Card className="absolute inset-0 opacity-50 bg-[url('https://images.ctfassets.net/v78wipeni189/1ys4COBxrKXRFiYYdLcJt4/918346c4a24e2ea9d922c44feedaeba6/iStock-1438205719_1.png?fm=webp&w=1920&q=80&h=720')] h-full w-full z-0 bg-cover bg-center mask-l-from-10% mask-l-to-90%" ></Card>
          <div className="flex flex-col gap-2 justify-start items-start z-0">

            <CardContent className="h-28">
              <div className="space-y-1">
                <Button variant={"link"} asChild>
                  <Link href={"/dashboard/drivers"}>
                    <ArrowLeft /> Back
                  </Link>
                </Button>
                <h1 className="text-3xl tracking-tight">Driver Profile</h1>
                <p className="text-muted-foreground text-sm">
                  View, update or delete.
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
      <div className="grid  gap-3">
        <Tabs defaultValue="personal" className="grid grid-rows-[auto_2em_1fr] grid-cols-[2fr_1fr] gap-5 gap-x-10">
          <BannerHeader driverDetails={driverDetails} />
          <TabsList variant={"line"} className="w-full col-start-1">
            <Trigger value="personal">
              <User /> Personal
            </Trigger>
            <Trigger value="licence">
              <IdCard />
              Driving Licence
            </Trigger>
            <Trigger value="legal">
              <BookUser />
              Legal
            </Trigger>
            <Trigger value="finance">
              <Landmark />
              Tax & Finance
            </Trigger>
            <Trigger value="contracts">
              <Signature />
              Contracts
            </Trigger>
            <Trigger value="additional">
              <FileSearch />
              Additional
            </Trigger>
          </TabsList>
          <div className="col-start-1 flex flex-col gap-2">
            <TabsContent value="personal">
              <DriverDetials
                disabled={!isEditing}
                driverDetails={driverDetails}
              />
            </TabsContent>
            <TabsContent value="licence">
              <div id="driving-licence" className="flex flex-col gap-3">
                <Licence driverDetails={driverDetails} />
              </div>
            </TabsContent>
            <TabsContent value="legal">
              <div id="legal" className="flex flex-col gap-3">
                <Legal driverDetails={driverDetails} />
              </div>
            </TabsContent>
            <TabsContent value="finance">
              <div id="finance" className="flex flex-col gap-3">
                <Finance driverDetails={driverDetails} />
              </div>
            </TabsContent>
            <TabsContent value="contract">
              <div id="contracts" className="flex flex-col gap-3">
                <Contracts driverDetails={driverDetails} />
              </div>
            </TabsContent>
            <TabsContent value="additional">
              <div id="additional" className="flex flex-col gap-3">
                <DriverContracts driverDetails={driverDetails} />
              </div>
            </TabsContent>
            <Button size={"lg"} className="h-10">
              Save Changes
            </Button>
          </div>
          <div className="col-start-2 row-start-1 row-span-full">
            <SidePanel driverDetails={driverDetails} />
          </div>
        </Tabs>
      </div>
    </div>
  );
}

function Trigger({
  children,
  value,
}: {
  children: React.ReactNode;
  value: string;
}) {
  return (
    <TabsTrigger
      value={value}
      className="h-10 data-active:text-primary! tracking-widest data-active:after:bg-primary "
    >
      {children}
    </TabsTrigger>
  );
}
