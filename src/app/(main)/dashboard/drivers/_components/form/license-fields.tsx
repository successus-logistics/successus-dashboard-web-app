import { Contact } from "lucide-react";
import { DriverRecord, PartialDriverRecord } from "../../types";
import FormSection from "../form";
import { DriverField } from "./field";
import DriverDatePicker from "../driver-date-picker";
import FileDropzone from "@/components/ui/file-dropzone";
import { Field, FieldLabel } from "@/components/ui/field";

export default function LicenseFields({
  driver,
  onUpdate,
}: {
  driver: PartialDriverRecord;
  onUpdate: (key: keyof DriverRecord, val: string | File) => void;
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
        value={driver.licence_categories}
        onChange={(value) => onUpdate("licence_categories", value)}
      />
      <DriverDatePicker
        label="Expiry date"
        id="driver-licence-expiry"
        value={driver.licence_expiry}
        onChange={(value) => onUpdate("license_expiry_date", value)}
      />
      <DriverField
        label="Penalty points"
        id="driver-licence-points"
        type="number"
        value={driver.licence_points}
        onChange={(value) => onUpdate("licence_points", value)}
      />

      <Field className="col-span-full">
        <FieldLabel>License Front Image</FieldLabel>
        <FileDropzone
          name="license_front_image"
          allowed_ext={"pdf, jpg, jpeg, webP"}
        />
      </Field>
      <Field className="col-span-full">
        <FieldLabel>License Back Image</FieldLabel>
        <FileDropzone
          name="license_back_image"
          allowed_ext={".png, .jpg, .jpeg, .webP"}
          onChange={(value) => onUpdate("license_back_image", value)}
        />
      </Field>
    </FormSection>
  );
}
