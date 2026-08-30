import { UserRound } from "lucide-react";
import FormSection from "../form";
import { DriverField } from "./field";
import DriverDatePicker from "../driver-date-picker";
import { DriverRecord, PartialDriverRecord } from "../../types";

export default function PersonalFields({
  driver,
  onUpdate,
}: {
  driver: PartialDriverRecord;
  onUpdate: (key: keyof DriverRecord, value: string) => void;
}) {
  return (
    <FormSection
      title="1. Personal"
      description="Identity and contact details."
      icon={UserRound}
    >
      <DriverField
        label="First name"
        id="driver-first-name"
        value={driver.first_name ?? ""}
        required
        onChange={(value) => onUpdate("first_name", value)}
      />
      <DriverField
        label="Last name"
        id="driver-last-name"
        value={driver.last_name ?? ""}
        required
        onChange={(value) => onUpdate("last_name", value)}
      />
      <DriverDatePicker
        label="Date of birth"
        id="driver-date-of-birth"
        value={driver.dob ?? ""}
        onChange={(value) => onUpdate("dob", value)}
      />
      <DriverField
        label="Phone"
        id="driver-phone_number"
        type="tel"
        value={driver.phone_number ?? ""}
        required
        onChange={(value) => onUpdate("phone_number", value)}
      />
      <DriverField
        label="Email"
        id="driver-email"
        type="email"
        value={driver.email ?? ""}
        required
        onChange={(value) => onUpdate("email", value)}
      />
      <DriverField
        label="Address"
        id="driver-address"
        value={driver.address ?? ""}
        className="sm:col-span-2"
        onChange={(value) => onUpdate("address", value)}
      />
    </FormSection>
  );
}
