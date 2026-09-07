import { Button } from "@/components/ui/button";
import { DriverRecord } from "../../types";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DriverField } from "../../_components/form/field";
import { DetialField } from "../../_components/detail-field";
import ImageField from "../../_components/image-field";

export default function Licence({
  driverDetails,
  disabled = true,
}: {
  driverDetails: DriverRecord;
  disabled?: boolean
}) {

  return (
    <Card className="grid grid-rows-[auto_1fr_auto] h-full">
      <CardHeader>
        <CardTitle className="font-semibold ">
          Driving Licence
        </CardTitle>
        <CardDescription className="text-sm">
          {driverDetails.full_name}
        </CardDescription>
      </CardHeader>
      <CardContent >
        <div className="w-full grid grid-cols-2 gap-5">
          <DetialField field="Licence number" value={driverDetails.licence_number} />
          <DetialField field="Issued" value={driverDetails.licence_issue_date} />
          <DetialField field="Expires on" value={driverDetails.licence_expiry_date} />
          <DetialField field="Country" value={driverDetails.licence_country} />
          <DetialField field="Points" value={driverDetails.points} />
          <DetialField field="Licence Type" value={driverDetails.categories} />
          <div className="flex flex-col gap-2 col-span-full">
            <ImageField field="Licence Front" image={"https://images.pexels.com/photos/27347529/pexels-photo-27347529.jpeg"} />
            <ImageField field="Licence Back" image={driverDetails.licence_back_image} />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button size={"lg"} className="h-10">Save Changes</Button>
      </CardFooter>
    </Card >
  );
}
