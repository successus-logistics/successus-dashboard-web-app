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
import { Camera, NotebookPen, Pencil } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

export default function DriverDetials({
  driverDetails,
  disabled = true,
}: {
  driverDetails: DriverRecord;
  disabled?: boolean;
}) {
  return (
    <div id="personal" className="grid grid-rows-[auto_1fr] h-full grid-cols-1 gap-10">
      <Card className="shadow-2xl h-full scrollbar-none p-2! grid">
        <CardHeader>
          <CardTitle className="font-semibold">Personal Information</CardTitle>
          <CardDescription className="text-sm">
            Edit driver details and contact information
          </CardDescription>
          <Separator />
        </CardHeader>
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
          </div>
        </CardContent>
      </Card>
      <Card className="h-full!">
        <CardHeader>
          <CardTitle className="flex gap-2 items-center">
            <NotebookPen />
            Notes</CardTitle>
        </CardHeader>
        <CardContent className="h-full">
          <Textarea className="h-full" placeholder="Add notes about this driver..."></Textarea>
        </CardContent>
      </Card>
    </div>
  );
}
