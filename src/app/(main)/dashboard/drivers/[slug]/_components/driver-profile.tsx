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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DriverRecord } from "../../types";
import { useState } from "react";
import Licence from "./licence";
import { Separator } from "@/components/ui/separator";
import Legal from "./legal";
import { Badge } from "@/components/ui/badge";
import Finance from "./finance";
import Contracts from "./contracts";
import BannerHeader from "./banner-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      <div defaultValue="personal" className="grid gap-5">
        <div
          defaultValue="personal"
          className="relative flex flex-col justify-start *:self-start *:justify-self-start min-w-48  h-full row-span-full"
        >
          <Card className="absolute inset-0 opacity-50  bg-[url('https://plus.unsplash.com/premium_photo-1681487526392-6183829c5f80?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] h-full w-full z-0 bg-cover bg-top mask-l-from-20% mask-l-to-90%" />
          <div className="flex flex-col gap-2 justify-start items-start z-0">
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
          </div>
        </div>
      </div>
      <BannerHeader driverDetails={driverDetails} />
      <div className="grid auto-rows-min grid-cols-1 gap-5">
        <Tabs defaultValue="personal">
          <TabsList>
            <Trigger value="personal">
              <User /> Personal
            </Trigger>
            <Trigger value="driving-licence">
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
          <TabsContent value="personal">
            <div id="personal" className="flex flex-col gap-3">
              <DriverDetials
                disabled={!isEditing}
                driverDetails={driverDetails}
              />
            </div>
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
  function smoothScroll() {
    const target = document.querySelector("#" + value);
    const targetPosition = target.getBoundingClientRect().top;
    const offsetPosition = targetPosition + window.pageYOffset - 50;
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }
  return (
    <TabsTrigger
      value={value}
      onClick={smoothScroll}
      className="font-medium data-active:text-primary data-active:border-r data-active:border-primary data-active:bg-accent/50 p-3 py-4 w-full text-start! justify-start pl-0  flex items-center gap-2 cursor-pointer"
    >
      {children}
    </TabsTrigger>
  );
}
