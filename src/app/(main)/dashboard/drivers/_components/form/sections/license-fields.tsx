import { Contact } from "lucide-react";
import { DriverRecord, PartialDriverRecord } from "../../../types";
import FormSection from "../../form";
import { DriverField } from "./../field";
import DriverDatePicker from "../../driver-date-picker";
import FileDropzone from "@/components/ui/file-dropzone";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export type LicenceType = NonNullable<DriverRecord["licence_submission"]>

interface LicenceProps {
  licence: DriverRecord["licence_submission"];
  onUpdate: <K extends keyof LicenceType>(
    key: K,
    value: LicenceType[K],
  ) => void;
}

export default function LicenceFields({ licence, onUpdate }: LicenceProps) {
  if (!licence) return null;
  let licenceUpdate = (key, val) => onUpdate("licence_submission", key, val)
  let attachmentUpdate = (key, val) => onUpdate("attachments", key, val)
  return (
    <FormSection
      title="2. Licence"
      description="Driving entitlement and endorsements."
      icon={Contact}
    >
      <DriverField
        label="Licence number"
        id="driver-licence-number"
        value={licence.licence_number}
        onChange={(value) => licenceUpdate("licence_number", value)}
      />
      <DriverField
        label="Issued Country"
        id="driver-licence-country"
        value={licence.licence_country}
        onChange={(value) => licenceUpdate("licence_country", value)}
      />
      <DriverDatePicker
        label="Issue date"
        id="driver-licence-issued"
        value={licence.licence_issue_date}
        onChange={(value) => licenceUpdate("licence_issue_date", value)}
      />
      <DriverDatePicker
        label="Expiry date"
        id="driver-licence-expiry"
        value={licence.licence_expiry_date}
        onChange={(value) => licenceUpdate("licence_expiry_date", value)}
      />
      <DriverField
        label="Penalty points"
        id="driver-licence-points"
        type="number"
        value={licence.points}
        onChange={(value) => licenceUpdate("points", Number(value))}
      />

      <Field>
        <FieldLabel>Category</FieldLabel>
        <Select
          name="catogeries"
          onValueChange={(value) => licenceUpdate("categories", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select License Type" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="full_licence">Full License</SelectItem>
            <SelectItem value="automatic_licence">Automatic License</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      <Field className="col-span-full">
        <FieldLabel>License Front Image</FieldLabel>
        <FileDropzone
          name="licence_front_image"
          allowed_ext={"pdf, jpg, jpeg, webP"}
          onChange={(file) => attachmentUpdate("licence_front_image", file)}
        />
      </Field>
      <Field className="col-span-full">
        <FieldLabel>License Back Image</FieldLabel>
        <FileDropzone
          name="licence_back_image"
          allowed_ext={".png, .jpg, .jpeg, .webP"}
          onChange={(value) => attachmentUpdate("licence_back_image", value)}
        />
      </Field>
    </FormSection>
  );
}
