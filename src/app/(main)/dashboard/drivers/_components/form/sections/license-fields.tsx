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

interface LicenceProps {
  licence: DriverRecord["licence_submission"];
  onUpdate: <K extends keyof NonNullable<DriverRecord["licence_submission"]>>(
    key: K,
    value: NonNullable<DriverRecord["licence_submission"]>[K],
  ) => void;
}

export default function LicenceFields({ licence, onUpdate }: LicenceProps) {
  if (!licence) return null;
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
        onChange={(value) => onUpdate("licence_number", value)}
      />
      <DriverField
        label="Issued Country"
        id="driver-licence-country"
        value={licence.licence_country}
        onChange={(value) => onUpdate("licence_country", value)}
      />
      <DriverDatePicker
        label="Issue date"
        id="driver-licence-issued"
        value={licence.licence_issue_date}
        onChange={(value) => onUpdate("licence_issue_date", value)}
      />
      <DriverDatePicker
        label="Expiry date"
        id="driver-licence-expiry"
        value={licence.licence_expiry_date}
        onChange={(value) => onUpdate("licence_expiry_date", value)}
      />
      <DriverField
        label="Penalty points"
        id="driver-licence-points"
        type="number"
        value={licence.points}
        onChange={(value) => onUpdate("points", Number(value))}
      />

      <Field>
        <FieldLabel>Category</FieldLabel>
        <Select
          name="catogeries"
          onValueChange={(value) => onUpdate("categories", value)}
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
          onChange={(file) => onUpdate("licence_front_image", file)}
        />
      </Field>
      <Field className="col-span-full">
        <FieldLabel>License Back Image</FieldLabel>
        <FileDropzone
          name="licence_back_image"
          allowed_ext={".png, .jpg, .jpeg, .webP"}
          onChange={(value) => onUpdate("licence_back_image", value)}
        />
      </Field>
    </FormSection>
  );
}
