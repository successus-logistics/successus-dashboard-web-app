import { FileCheck2 } from "lucide-react";
import DriverDatePicker from "../../driver-date-picker";
import FormSection from "../../form";
import FileDropzone from "@/components/ui/file-dropzone";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DriverRecord } from "../../../types";
import { LicenceType } from "./license-fields";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ImageField from "../../image-field";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/file_upload";

interface LegalData {
  data: DriverRecord["legal"];
  onUpdate: <K extends keyof LicenceType>(
    key: K,
    value: LicenceType[K],
  ) => void;
}

export default function RTWFields({ data, onUpdate }: LegalData) {
  return (
    <FormSection
      title="3. Compliance Documents"
      description="Document validity and overall compliance."
      icon={FileCheck2}
    >
      <Field className="col-span-full">
        <FieldLabel required htmlFor="document_type">
          Document Type
        </FieldLabel>
        <Select
          required
          defaultValue={data?.document_type ?? ""}
          onValueChange={(value) => onUpdate("document_type", value)}
        >
          <SelectTrigger>
            <SelectValue id="document_type" placeholder="Document Type" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectGroup>
              <SelectItem value="passport">UK or Irish Passport</SelectItem>
              <SelectItem value="birth">
                UK or Irish Birth Certificate + NI Evidence
              </SelectItem>
              <SelectItem value="share_code">Share Code</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <DriverDatePicker
        label="Valid From"
        id="valid_from"
        value={data?.expiry_date ?? ""}
        onChange={(value) => onUpdate("valid_from", value)}
      />
      <DriverDatePicker
        label="Expiry Date"
        id="expiry_date"
        value={data?.expiry_date ?? ""}
        onChange={(value) => onUpdate("expiry_date", value)}
      />
      {data.document_type === "passport" && (
        <FieldGroup className="col-span-full grid grid-cols-2 ">
          <Field className="col-span-full">
            <FieldLabel htmlFor="passport_no">Passport Number</FieldLabel>
            <Input
              id="passsport_no"
              name="passport_number"
              placeholder="Passport Number"
              onChange={(value) => onUpdate("passport_number", value)}
            />
          </Field>
        </FieldGroup>
      )}
      {data.document_type == "share_code" && (
        <Field className="col-span-full">
          <FieldLabel htmlFor="share_code" required>
            Share Code
          </FieldLabel>
          <Input
            id="share_code"
            type="text"
            required
            name="share_code"
            placeholder="Share Code Number..."
          />
        </Field>
      )}

      <FieldGroup className="col-span-full">
        <FieldLegend>Evidence</FieldLegend>
        {Object.entries(data.attachments).length === 0 ? (
          <Field>
            <FileDropzone
              name="document"
              allowed_ext=".png, .pdf"
              onChange={(file) => {
                console.log("file:", file);
                onUpdate("attachments", {
                  ...data.attachments,
                  passport_number: file,
                });
              }}
            />
          </Field>
        ) : (
          Object.entries(data.attachments).map(([key, file]) => (
            <Field key={key}>
              <FieldLabel>{key}</FieldLabel>
              <FileDropzone
                name="document"
                file={file}
                allowed_ext=".png, .pdf, .jpg, .webP"
                onChange={(file) => {
                  const prev = data.attachments;
                  if (!file) {
                    const { [key]: _, ...removed } = prev;
                    onUpdate("attachments", removed);
                  } else {
                    const { [key]: _, ...added } = prev;
                    onUpdate("attachments", added);
                  }
                }}
              />
            </Field>
          ))
        )}
      </FieldGroup>
      <Field>
        <FieldLabel>Supporting Evidence</FieldLabel>

        <FileUpload />
      </Field>
      <Field className="col-span-full">
        <FieldLabel>Notes</FieldLabel>
        <Textarea name="notes" placeholder="Additional Notes..."></Textarea>
      </Field>
    </FormSection>
  );
}
