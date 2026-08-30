import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import FormSection from "../form";
import { Field, FieldLabel } from "@/components/ui/field";

export default function EmploymentFields({ driver, onUpdate }) {
  return (
    <FormSection
      title="2. Employment"
      description="Role, status and reporting structure."
      icon={BriefcaseBusiness}
    >
      <Field>
        <FieldLabel htmlFor="driver-status">Driver status</FieldLabel>
        <NativeSelect
          id="driver-status"
          className="w-full"
          value={driver.isActive ? "active" : "delete"}
          onChange={(event) =>
            onUpdate("isActive", event.target.value === "active" ? true : false)
          }
        >
          <NativeSelectOption value={"active"}>Active</NativeSelectOption>
          <NativeSelectOption value={"delete"}>Delete</NativeSelectOption>
        </NativeSelect>
      </Field>
    </FormSection>
  );
}
