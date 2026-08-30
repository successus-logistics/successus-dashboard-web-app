import { Contact } from "lucide-react";
import { PartialDriverRecord } from "../../types";
import FormSection from "../form";
import { DriverField } from "./field";
import DriverDatePicker from "../driver-date-picker";

export default function LicenseFields({
  driver,
  onUpdate,
}: {
  driver: PartialDriverRecord;
  onUpdate: (key: string, val: string) => void;
}) {
  return (
    <FormSection
      title="3. Licence"
      description="Driving entitlement and endorsements."
      icon={Contact}
    >
      <DriverField
        label="Licence number"
        id="driver-licence-number"
        value={driver.license_number}
        onChange={(value) => onUpdate("license_number", value)}
      />
      <DriverField
        label="Categories"
        id="driver-licence-categories"
        value={driver.licenceCategories}
        onChange={(value) => update("licenceCategories", value)}
      />
      <DriverDatePicker
        label="Expiry date"
        id="driver-licence-expiry"
        value={driver.licence_expiry}
        onChange={(value) => onUpdate("license_expiry", value)}
      />
      <DriverField
        label="Penalty points"
        id="driver-licence-points"
        type="number"
        value={driver.licencePoints}
        onChange={(value) => update("licencePoints", Number(value))}
      />
    </FormSection>
  );
}
