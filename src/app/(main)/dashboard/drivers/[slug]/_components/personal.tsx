import { DriverRecord } from "../../types";
import { DetialField } from "../../_components/detail-field";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export default function DriverDetials({
  driverDetails,
  disabled = true,
}: {
  driverDetails: DriverRecord;
  disabled?: boolean
}) {

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="font-semibold">Personal Information</CardTitle>
        <CardDescription className="text-sm">Driver information</CardDescription>
      </CardHeader>
      <CardHeader className="flex flex-col gap-2">
        <div className="flex w-full justify-between">
          <Avatar className="h-32 w-32">
            <AvatarImage src={driverDetails.profile_picture} />
            <AvatarFallback className="text-5xl">
              {driverDetails.first_name[0]}
              {driverDetails.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <Button variant={"outline"} className={disabled ? "bg-accent data-active:bg-accent hover:bg-accent justify-self-end" : ""}>
            <Pencil />
            Edit
          </Button>
        </div>
        <CardTitle className="font-semibold text-xl">
          {driverDetails.full_name}
        </CardTitle>
      </CardHeader>
      <CardContent >
        <div className="w-full grid grid-cols-2 gap-5">
          <DetialField disabled={disabled} field="First Name" value={driverDetails.first_name} />
          <DetialField disabled={disabled} field="Last Name" value={driverDetails.last_name} />
          <DetialField disabled={disabled} field="Phone Number" value={driverDetails.phone_number} />
          <DetialField disabled={disabled} field="Email" value={driverDetails.email} />
          <DetialField field="NI Number" value={driverDetails.ni} />
          <DetialField field="UTR Number" value={driverDetails.utr} />
          <DetialField field="VAT Number" value={driverDetails.vat} />
        </div>
      </CardContent>
      <CardFooter>
        <Button size={"lg"} className="h-10">Save Changes</Button>
      </CardFooter>
    </Card >
  );
}
