import { Contact } from "lucide-react";
import { AttachmentType, DriverRecord } from "../../../types";
import { useDriverDraft } from "../driver-draft-context";
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

export type LicenceType = NonNullable<DriverRecord["licence_submission"]>;

export default function LicenceFields() {
  const { draft, updateField, removeFile, addFile } = useDriverDraft();
  const licence = draft.licence_submission;
  if (!licence) return null;
  const updateLicence = <K extends keyof LicenceType>(
    field: K,
    value: LicenceType[K],
  ) => updateField("licence_submission", field, value);
  const addLicenceFile = (attachment: Record<string, AttachmentType>) =>
    addFile("licence_submission", attachment);
  const removeLicenceFile = (attachment: AttachmentType) =>
    removeFile("licence_submission", attachment);
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
        onChange={(value) => updateLicence("licence_number", value)}
      />
      <DriverField
        label="Issued Country"
        id="driver-licence-country"
        value={licence.licence_country}
        onChange={(value) => updateLicence("licence_country", value)}
      />
      <DriverDatePicker
        label="Issue date"
        id="driver-licence-issued"
        value={licence.licence_issue_date}
        onChange={(value) => updateLicence("licence_issue_date", value)}
      />
      <DriverDatePicker
        label="Expiry date"
        id="driver-licence-expiry"
        value={licence.licence_expiry_date}
        onChange={(value) => updateLicence("licence_expiry_date", value)}
      />
      <DriverField
        label="Penalty points"
        id="driver-licence-points"
        type="number"
        value={licence.points}
        onChange={(value) => updateLicence("points", Number(value))}
      />

      <Field>
        <FieldLabel>Category</FieldLabel>
        <Select
          name="catogeries"
          onValueChange={(value) => updateLicence("categories", value)}
          defaultValue={draft.licence_submission.categories}
        >
          <SelectTrigger>
            <SelectValue
              placeholder="Select License Type"
              defaultValue={draft.licence_submission.categories}
            />
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
          file={licence.attachments.licence_front_image}
          removeFile={(file) => removeLicenceFile(file)}
          addFile={(file) => {
            addLicenceFile({
              licence_front_image: {
                file_name: "licence_front_image",
                file: file,
                start_date: draft.licence_submission.licence_issue_date,
                expiry_date: draft.licence_submission.licence_expiry_date,
                file_type: file.type,
                file_size: file.size,
              },
            });
          }}
        />
      </Field>
      <Field className="col-span-full">
        <FieldLabel>License Back Image</FieldLabel>
        <FileDropzone
          name="licence_back_image"
          allowed_ext={".png, .jpg, .jpeg, .webP"}
          file={licence.attachments.licence_back_image}
          removeFile={(file) => removeLicenceFile(file)}
          addFile={(file) => {
            addLicenceFile({
              licence_back_image: {
                file_name: "licence_back_image",
                file: file,
                start_date: draft.licence_submission.licence_issue_date,
                expiry_date: draft.licence_submission.licence_expiry_date,
                file_type: file.type,
                file_size: file.size,
              },
            });
          }}
        />
      </Field>
    </FormSection>
  );
}
