import { FileCheck2 } from "lucide-react";
import DriverDatePicker from "../../driver-date-picker";
import FormSection from "../../form";
import FileDropzone from "@/components/ui/file-dropzone";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function FinacialFields({ driver, onUpdate }) {
  const [sortCode, setSortCode] = useState("");
  return (
    <FormSection
      title="5. Financial & Tax"
      description="payroll/payment details."
      icon={FileCheck2}
    >
      <FieldSet className="col-span-full ">
        <FieldLegend className="shadow-[0_1px_0_0] shadow-foreground/10 w-full">
          Bank Details
        </FieldLegend>
        <FieldGroup className="col-span-full grid grid-cols-2">
          <Field className="col-span-full">
            <FieldLabel>Account Name</FieldLabel>
            <Input type="text" name="account_name" placeholder="John Doe" />
          </Field>
          <Field>
            <FieldLabel>Account Number</FieldLabel>
            <Input
              minLength={8}
              maxLength={34}
              type="text"
              name="account_number"
              placeholder="12345678"
            />
          </Field>
          <Field>
            <FieldLabel>Sort Code</FieldLabel>
            <Input
              type="text"
              name="sort_code"
              placeholder="xx-xx-xx"
              maxLength={8}
              value={sortCode.replace(/(\d{2})(?=\d)/g, "$1-")}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setSortCode(value);
              }}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSet className="col-span-full">
        <FieldLegend className="shadow-[0_1px_0_0] shadow-foreground/10 w-full">
          Tax Information
        </FieldLegend>
        <FieldGroup className="col-span-full grid grid-cols-2">
          <Field>
            <FieldLabel>National Insurance</FieldLabel>
            <Input
              minLength={9}
              maxLength={13}
              placeholder="AB123456C"
              type="text"
              name="ni_number"
            />
          </Field>
          <Field>
            <FieldLabel>UTR</FieldLabel>
            <Input
              placeholder="1234567890"
              minLength={10}
              maxLength={10}
              type="text"
              name="utr"
            />
          </Field>
          <Field>
            <FieldLabel>VAT</FieldLabel>
            <Input
              placeholder="123456789"
              minLength={9}
              maxLength={9}
              type="text"
              name="vat"
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FormSection>
  );
}
