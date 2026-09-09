import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, parse } from "date-fns";
import { enGB } from "date-fns/locale";
import { useState } from "react";
import { DatePickerInput } from "@/components/ui/date-picker";

export default function DriverDatePicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string | undefined) => void;
}) {
  const selectedDate = value
    ? parse(value, "yyyy-MM-dd", new Date())
    : undefined;

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <DatePickerInput
        dateValue={selectedDate}
        updateDateValue={(newDate) => {
          if (newDate) {
            onChange(newDate);
          }
        }}
      />
    </Field>
  );
}
