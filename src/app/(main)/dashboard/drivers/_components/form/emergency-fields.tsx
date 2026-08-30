import { ShieldUser } from "lucide-react";
import FormSection from "../form";
import { DriverField } from "./field";

export default function RTWFields({ driver, onUpdate }) {
  return (
    <FormSection
      title="6. Emergency Contact"
      description="Primary contact for an emergency."
      icon={ShieldUser}
    >
      <DriverField
        label="Contact name"
        id="driver-emergency-name"
        value={driver.emergencyContactName}
        onChange={(value) => onUpdate("emergencyContactName", value)}
      />
      <DriverField
        label="Relationship"
        id="driver-emergency-relationship"
        value={driver.emergencyContactRelationship}
        onChange={(value) => onUpdate("emergencyContactRelationship", value)}
      />
      <DriverField
        label="Contact phone_number"
        id="driver-emergency-phone_number"
        type="tel"
        value={driver.emergencyContactPhone}
        onChange={(value) => onUpdate("emergencyContactPhone", value)}
      />
    </FormSection>
  );
}
