import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function DriverField({
  label,
  id,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
  className,
}: {
  label: string;
  id: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  className?: string;
}) {
  return (
    <Field className={className}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        type={type}
        defaultValue={value}
        required={required}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        onChange={(event) => onChange(event.target.value)}
      />
    </Field>
  );
}
