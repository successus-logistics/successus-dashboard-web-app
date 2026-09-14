import { DriverRecord } from "../../types";
import { DetialField } from "../../_components/detail-field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Camera, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default function DriverDetials({
  driverDetails,
  disabled = true,
}: {
  driverDetails: DriverRecord;
  disabled?: boolean;
}) {
  return (
    <>
      <CardHeader>
        <CardTitle className="font-semibold">Personal Information</CardTitle>
        <CardDescription className="text-sm">
          Driver information
        </CardDescription>
        <Separator />
      </CardHeader>
      <Card className="shadow-2xl col-start-2 h-full scrollbar-none p-2! grid">
        <Card>
          <CardContent>
            <div className="w-full grid grid-cols-2 gap-5">
              <DetialField
                disabled={disabled}
                field="First Name"
                value={driverDetails.first_name}
              />
              <DetialField
                disabled={disabled}
                field="Last Name"
                value={driverDetails.last_name}
              />
              <DetialField
                disabled={disabled}
                field="Phone Number"
                value={driverDetails.phone_number}
              />
              <DetialField
                disabled={disabled}
                field="Email"
                value={driverDetails.email}
              />
              <DetialField field="NI Number" value={driverDetails.ni} />
              <DetialField field="UTR Number" value={driverDetails.utr} />
              <DetialField field="VAT Number" value={driverDetails.vat} />
            </div>
          </CardContent>
          <CardFooter>
            <Button size={"lg"} className="h-10">
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </Card>
    </>
  );
}
