import { apiFetch } from "@/lib/auth/client";
import { DriverRecord } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NotFound from "@/app/not-found";
import DriverDetials from "../_components/driver-details";
import { AvatarRoot } from "@base-ui/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeftCircle, Pencil, Trash } from "lucide-react";
import DriverContracts from "../_components/driver-contracts";
import DriverDocuments from "../_components/driver-documents";
import Link from "next/link";

async function getDriverDetails(slug: string) {
  try {
    const driverDetials = await apiFetch<DriverRecord>(
      `/api/fleet/drivers/${slug}`,
    );
    return driverDetials;
  } catch (e) {
    return false;
  }
}

export default async function DriverProfile({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const driverDetails = await getDriverDetails(slug);
  if (driverDetails) {
    return (
      <div className="grid grid-cols-[1fr_2fr] grid-rows-[auto_1fr_1fr] gap-5 max-h-screen">
        <div className="flex justify-between col-span-full items-end">
          <div className="space-y-1">
            <Button variant={"link"} asChild>
              <Link href={"/dashboard/drivers"}>
                <ArrowLeftCircle /> Back
              </Link>
            </Button>
            <h1 className="text-3xl tracking-tight">Driver Profile</h1>
            <p className="text-muted-foreground text-sm">
              Monitor traffic, engagement, and conversion performance in one
              view.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant={"outline"}>
              <Pencil />
              Edit
            </Button>
            <Button variant={"destructive"}>
              <Trash />
              Delete
            </Button>
          </div>
        </div>
        <Card className="row-span-2 col-start-1">
          <CardHeader className="flex flex-col items-center gap-2">
            <Avatar className="h-32 w-32">
              <AvatarImage src={driverDetails.profile_picture} />
              <AvatarFallback className="text-5xl">
                {driverDetails.first_name[0]}
                {driverDetails.last_name[0]}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="font-semibold text-xl">
              {driverDetails.full_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <DriverDetials driverDetails={driverDetails} />
          </CardContent>
        </Card>
        <div className="col-start-2">
          <DriverDocuments />
        </div>
        <Card className="col-start-2 h-full scrollbar-none p-2">
          <DriverContracts />
        </Card>
      </div>
    );
  }
  return <NotFound />;
}
