"use client"
import DriverDetials from "./personal";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, BookUser, FileSearch, IdCard, Landmark, Pencil, Signature, Trash, User } from "lucide-react";
import DriverContracts from "./driver-contracts";
import DriverDocuments from "./driver-documents";
import Link from "next/link";
import { Tabs } from "radix-ui";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverRecord } from "../../types";
import { useState } from "react";
import Licence from "./licence";
import { badgeVariants } from "@/components/ui/badge";
import { off } from "process";

export default function DriverProfile({ driverDetails }: { driverDetails: DriverRecord }) {
  const [isEditing, setIsEditing] = useState(false)
  return (
    <div className="grid grid-cols-1 grid-rows-[auto_1fr] gap-5 h-full scroll-smooth">

      <div defaultValue="personal" className="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_1fr] gap-5">
        <div defaultValue="personal" className="flex flex-col justify-start *:self-start *:justify-self-start min-w-48 w-fit  h-full row-span-full sticky top-14" >
          <div className="sticky top-14 flex flex-col gap-3">
            <div className="flex flex-col gap-2 justify-start items-start">
              <div className="space-y-1">
                <Button variant={"link"} asChild>
                  <Link href={"/dashboard/drivers"}>
                    <ArrowLeftCircle /> Back
                  </Link>
                </Button>
                <h1 className="text-3xl tracking-tight">Driver Profile</h1>
                <p className="text-muted-foreground text-sm">
                  View, update or delete.
                </p>
              </div>
            </div>
            <div>
              <Trigger value="personal">
                <User /> Personal
              </Trigger>
              <Trigger value="driving-licence"><IdCard />Driving Licence</Trigger>
              <Trigger value="legal" ><BookUser />Legal</Trigger>
              <Trigger value="financial"><Landmark />Tax & Finance</Trigger>
              <Trigger value="contracts"><Signature />Contracts</Trigger>
              <Trigger value="documents"><FileSearch />Documents</Trigger>
            </div>
            <div className="flex gap-2">
              <Button variant={"destructive"}>
                <Trash />
                Delete
              </Button>
            </div>
          </div>
        </div>
        <Card id="personal" className="col-start-2 h-full scrollbar-none p-2! grid">
          <DriverDetials disabled={!isEditing} driverDetails={driverDetails} />
        </Card>
        <Card id="driving-licence" className="col-start-2 h-full scrollbar-none p-2! grid">
          <Licence driverDetails={driverDetails} />
        </Card>
        <div className="col-start-2">
          <DriverDocuments />
        </div>
        <Card className="col-start-2 h-full scrollbar-none p-2">
          <DriverContracts />
        </Card>
        <Card className="col-start-2 h-full scrollbar-none p-2">
          <DriverContracts />
        </Card>
        <Card className="col-start-2 h-full scrollbar-none p-2">
          <DriverContracts />
        </Card>
      </div>
    </div>
  )
}

function Trigger({ children, value }: { children: React.ReactNode, value: string }) {
  function smoothScroll() {
    const target = document.querySelector("#" + value)
    const targetPosition = target.getBoundingClientRect().top;
    const offsetPosition = targetPosition + window.pageYOffset - 50
    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    })
  }
  return (
    <Button onClick={smoothScroll} variant={"ghost"} value={value} className="font-medium data-active:text-primary data-active:border-r data-active:border-primary data-active:bg-accent/50 p-3 py-4 w-full text-start! justify-start pl-0  flex items-center gap-2 cursor-pointer" >
      {children}
    </Button>
  )
}
