import { MapPinned } from "lucide-react";
import FormSection from "../form";
import { DriverField } from "./field";
import { Field, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";

export default function OperationFields({
  driver,
  onUpdate,
}: {
  driver;
  onUpdate;
}) {
  return (
    <FormSection
      title="7. Operations"
      description="Day-to-day assignment and payroll references."
      icon={MapPinned}
    >
      <DriverField
        label="UTR Number"
        id="driver-utr-number"
        value={driver.utr}
        onChange={(value) => onUpdate("utr", value)}
      />
      <DriverField
        label="VAT Number"
        id="driver-vat-number"
        value={driver.vat}
        onChange={(value) => onUpdate("vat", value)}
      />
      <Field className="sm:col-span-2">
        <FieldLabel htmlFor="driver-notes">Notes</FieldLabel>
        <Textarea
          id="driver-notes"
          value={driver.notes}
          onChange={(event) => onUpdate("notes", event.target.value)}
        />
      </Field>
    </FormSection>
  );
}
