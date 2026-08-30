import { DriverRecord } from "../types";
import { DetialField } from "./detail-field";

export default function DriverDetials({
  driverDetails,
}: {
  driverDetails: DriverRecord;
}) {
  return (
    <div className="flex flex-col justify-between h-full">
      <DetialField field="First Name" value={driverDetails.first_name} />
      <DetialField field="Last Name" value={driverDetails.last_name} />
      <DetialField field="Phone Number" value={driverDetails.phone_number} />
      <DetialField field="Email" value={driverDetails.email} />
      <DetialField field="NI Number" value={driverDetails.ni} />
      <DetialField field="UTR Number" value={driverDetails.utr} />
      <DetialField field="VAT Number" value={driverDetails.vat} />
    </div>
  );
}
