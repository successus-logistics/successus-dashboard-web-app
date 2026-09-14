import { FileCheck2 } from "lucide-react";
import DriverDatePicker from "../../driver-date-picker";
import FormSection from "../../form";
import FileDropzone from "@/components/ui/file-dropzone";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { AttachmentType, DriverRecord } from "../../../types";
import { useDriverDraft } from "../driver-draft-context";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/ui/file_upload";

export default function RTWFields() {
  const { draft, updateField, clearSection, addFile, removeFile } =
    useDriverDraft();
  const data = draft.legal;
  const updateLegal = <K extends keyof DriverRecord["legal"]>(
    field: K,
    value: DriverRecord["legal"][K],
  ) => updateField("legal", field, value);
  const addAttachment = (
    attachment: Record<string, AttachmentType>,
    required: boolean = true,
  ) => addFile("legal", attachment, required);
  const removeAttachment = (attachment: AttachmentType) =>
    removeFile("legal", attachment);
  return (
    <FormSection
      title="3. Compliance Documents"
      description="Document validity and overall compliance."
      icon={FileCheck2}
    >
      <FieldSet className="col-span-full">
        <FieldLegend>Document Information</FieldLegend>
        <FieldDescription>Please fill out all fields</FieldDescription>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field className="col-span-full">
            <FieldLabel required htmlFor="document_type">
              Document Type
            </FieldLabel>
            <Select
              required
              defaultValue={data?.document_type ?? ""}
              onValueChange={(value) => {
                clearSection("legal");
                updateLegal("document_type", value);
              }}
            >
              <SelectTrigger>
                <SelectValue id="document_type" placeholder="Document Type" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="PASSPORT">UK or Irish Passport</SelectItem>
                  <SelectItem value="BIRTH">
                    UK or Irish Birth Certificate + NI Evidence
                  </SelectItem>
                  <SelectItem value="SHARE_CODE">Share Code</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <DriverDatePicker
            label="Valid From"
            id="valid_from"
            value={data?.valid_from ?? ""}
            onChange={(value) => updateLegal("valid_from", value)}
          />
          <DriverDatePicker
            label="Expiry Date"
            id="expiry_date"
            value={draft.legal?.expiry_date ?? ""}
            onChange={(value) => updateLegal("expiry_date", value)}
          />
          {data.document_type === "PASSPORT" && (
            <FieldGroup className="col-span-full grid grid-cols-2 ">
              <Field className="col-span-full">
                <FieldLabel htmlFor="passport_no">Passport Number</FieldLabel>
                <Input
                  id="passsport_no"
                  name="passport_number"
                  placeholder="Passport Number"
                  defaultValue={draft.legal.passport_number}
                  onChange={(e) =>
                    updateLegal("passport_number", e.target.value)
                  }
                />
              </Field>
            </FieldGroup>
          )}
          {data.document_type == "SHARE_CODE" && (
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
                defaultValue={draft.legal.share_code}
                onChange={(e) => updateLegal("share_code", e.target.value)}
              />
            </Field>
          )}
        </div>
      </FieldSet>
      <FieldSeparator className="col-span-full" />

      {data.document_type && (
        <FieldGroup className="col-span-full gap-2">
          <FieldSet>
            <FieldLegend>Evidence</FieldLegend>
            <FieldDescription>Upload relevant evidence</FieldDescription>
            <Field>
              <div>
                <FieldLabel>{data.document_type.toLowerCase()}</FieldLabel>
              </div>
              <FileDropzone
                name="document"
                allowed_ext=".png, .jpg"
                file={data.attachments[data.document_type]}
                addFile={(file) => {
                  addAttachment(
                    {
                      [data.document_type]: {
                        file: file,
                        expiry_date: data.expiry_date,
                        start_date: data.valid_from,
                        file_name: data.document_type,
                        file_type: file.type,
                        file_size: file.size,
                      },
                    },
                    true,
                  );
                }}
                removeFile={(file) => removeAttachment(file)}
              />
            </Field>
            <div>
              <FieldLegend>Supporting Evidence</FieldLegend>
              <FieldDescription>
                Add additional supporting evidence
              </FieldDescription>
            </div>
            <div className="flex gap-2 flex-wrap ">
              {data.attachments.additional &&
                Object.entries(data.attachments.additional).map(
                  ([key, file]) => (
                    <Field key={key} className="w-fit max-w-56">
                      <FieldLabel>{file.file_name}</FieldLabel>
                      <FileDropzone
                        name={key}
                        file={file}
                        allowed_ext=".png, .pdf, .jpg, .webP"
                        removeFile={(file) => removeAttachment(file)}
                      />
                    </Field>
                  ),
                )}
            </div>
            <div>
              <FileUpload
                addFile={(name, newFile) => {
                  addAttachment(
                    {
                      [name]: {
                        file: newFile.file,
                        expiry_date: newFile.expiry_date,
                        start_date: newFile.start_date,
                        file_name: name,
                        file_type: newFile.file_type,
                        file_size: newFile.file?.size ?? 0,
                      },
                    },
                    false,
                  );
                }}
              />
            </div>
          </FieldSet>
        </FieldGroup>
      )}
      <Field className="col-span-full">
        <FieldLabel>Notes</FieldLabel>
        <Textarea
          onChange={(value) => updateLegal("notes", value.target.value)}
          name="notes"
          placeholder="Additional Notes..."
        ></Textarea>
      </Field>
    </FormSection>
  );
}
