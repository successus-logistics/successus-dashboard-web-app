import { FileCheck2 } from "lucide-react";
import FormSection from "../../form";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDriverDraft } from "../driver-draft-context";
import { DriverRecord } from "../../../types";

export default function FinacialFields() {
  const { draft, updateField } = useDriverDraft();
  const updateFinancial = <K extends keyof DriverRecord["driver"]>(
    field: K,
    value: DriverRecord["driver"][K],
  ) => updateField("driver", field, value);
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
            <Input
              type="text"
              name="account_name"
              placeholder="John Doe"
              defaultValue={draft.driver.bank_account_name ?? ""}
              onChange={(e) =>
                updateFinancial("bank_account_name", e.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel>Account Number</FieldLabel>
            <Input
              minLength={8}
              maxLength={34}
              type="text"
              name="account_number"
              placeholder="12345678"
              defaultValue={draft.driver.bank_account_number ?? ""}
              onChange={(e) =>
                updateFinancial("bank_account_number", e.target.value)
              }
            />
          </Field>
          <Field>
            <FieldLabel>Sort Code</FieldLabel>
            <Input
              type="text"
              name="sort_code"
              placeholder="xx-xx-xx"
              maxLength={8}
              value={(draft.driver.bank_sort_code ?? "").replace(
                /(\d{2})(?=\d)/g,
                "$1-",
              )}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                setSortCode(value);
                updateFinancial("bank_sort_code", value);
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
              defaultValue={draft.driver.ni_number ?? ""}
              onChange={(e) => updateFinancial("ni_number", e.target.value)}
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
              defaultValue={draft.driver.utr ?? ""}
              onChange={(e) => updateFinancial("utr", e.target.value)}
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
              defaultValue={draft.driver.vat ?? ""}
              onChange={(e) => updateFinancial("vat", e.target.value)}
            />
          </Field>
        </FieldGroup>
      </FieldSet>
    </FormSection>
  );
}
