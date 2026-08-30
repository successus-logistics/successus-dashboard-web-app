import { FileCheck2 } from "lucide-react";
import DriverDatePicker from "../driver-date-picker";
import FormSection from "../form";

export default function RTWFields({ driver, onUpdate }) {
  return (
    <FormSection
      title="5. Compliance Documents"
      description="Document validity and overall compliance."
      icon={FileCheck2}
    >
      <DriverDatePicker
        label="Right to work expiry"
        id="driver-right-to-work"
        value={driver.rightToWorkExpiry}
        onChange={(value) => onUpdate("rightToWorkExpiry", value)}
      />
    </FormSection>
  );
}
