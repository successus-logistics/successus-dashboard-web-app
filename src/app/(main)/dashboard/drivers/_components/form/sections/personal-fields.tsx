import { UserRound } from "lucide-react";
import FormSection from "../../form";
import { DriverField } from "../field";
import DriverDatePicker from "../../driver-date-picker";
import { DriverRecord, PartialDriverRecord } from "../../../types";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import FileDropzone from "@/components/ui/file-dropzone";

export default function PersonalFields({
  driver,
  onUpdate,
}: {
  driver: DriverRecord["driver"];
  onUpdate: (key: keyof DriverRecord["driver"], value: unknown) => void;
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
        onChange={(value) => {
          onUpdate("first_name", value);
          onUpdate("full_name", value + " " + (driver.last_name ?? ""));
        }}
      />
      <DriverField
        label="Last name"
        id="driver-last-name"
        value={driver.last_name ?? ""}
        required
        onChange={(value) => {
          onUpdate("last_name", value);
          onUpdate("full_name", (driver.first_name ?? "") + " " + value);
        }}
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
      <Field className="col-span-full">
        <FieldLabel>Proof of Address</FieldLabel>
        <FileDropzone
          allowed_ext=".png, .pdf, .jpg, webP, .docx"
          name="proof_of_address"
          onChange={() => null}
        />
      </Field>
      <FieldGroup className="col-span-full grid grid-cols-2">
        <DriverField
          label="Emergency Contact Name"
          id="emergency-contact"
          value={driver.address ?? ""}
          className="col-span-full"
          onChange={(value) => onUpdate("emergency_contact_name", value)}
        />
        <DriverField
          label="Emergency Contact Number"
          id="emergency-number"
          value={driver.emergency_contact_phone_number ?? ""}
          className="sm:col-span-1"
          onChange={(value) =>
            onUpdate("emergency_contact_phone_number", value)
          }
        />
        <DriverField
          label="Emergency Contact Relation"
          id="emergency-relation"
          value={driver.emergency_contact_relationship ?? ""}
          className="sm:col-span-1"
          onChange={(value) =>
            onUpdate("emergency_contact_relationship", value)
          }
        />
      </FieldGroup>
    </FormSection>
  );
}
