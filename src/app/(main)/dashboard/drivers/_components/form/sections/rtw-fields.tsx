import { FileCheck2 } from "lucide-react";
import DriverDatePicker from "../../driver-date-picker";
import FormSection from "../../form";
import FileDropzone from "@/components/ui/file-dropzone";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function RTWFields({ driver, onUpdate }) {
  const [documentType, setDocumentType] = useState("passport");
  return (
    <FormSection
      title="3. Compliance Documents"
      description="Document validity and overall compliance."
      icon={FileCheck2}
    >
      <Field>
        <FieldLabel>Document Type</FieldLabel>
        <NativeSelect
          defaultValue={documentType}
          onChange={(val) => setDocumentType(val.target.value)}
        >
          <NativeSelectOption value="passport">
            UK or Irish Passport
          </NativeSelectOption>
          <NativeSelectOption value="birth">
            UK or Irish Birth Certificate
          </NativeSelectOption>
          <NativeSelectOption value="share_code">Share Code</NativeSelectOption>
          <NativeSelectOption value="other">Other</NativeSelectOption>
        </NativeSelect>
      </Field>
      <DriverDatePicker
        label="Expiry Date"
        id="driver-right-to-work"
        value={driver.rightToWorkExpiry}
        onChange={(value) => onUpdate("rtw_expiry", value)}
      />
      {documentType !== "share_code" ? (
        <Field className="col-span-full">
          <FieldLabel>Evidence</FieldLabel>
          <FileDropzone
            name="document"
            allowed_ext=".png, .pdf"
            onChange={() => null}
          />
        </Field>
      ) : (
        <Field className="col-span-full">
          <FieldLabel required>Share Code</FieldLabel>
          <Input type="text" required name="share_code" />
        </Field>
      )}
    </FormSection>
  );
}
