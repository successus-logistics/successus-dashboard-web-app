"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";

function formatDate(date: Date | undefined) {
  if (!date) {
    return "";
  }

  return date.toLocaleDateString("en-CA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export function DatePickerInput({
  dateValue,
  updateDateValue,
}: {
  dateValue: Date | undefined;
  updateDateValue: (date: string | undefined) => void;
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(dateValue);
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));
  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={300}>
      <InputGroup>
        <HoverCardTrigger asChild>
          <InputGroupInput
            autoFocus={false}
            autoComplete="off"
            id="date-required"
            value={value}
            placeholder="1999-01-01"
            onChange={(e) => {
              setValue(e.target.value);
              if (isValidDate(new Date(e.target.value))) {
                const date = new Date(e.target.value);
                setDate(date);
                setMonth(date);
                updateDateValue(formatDate(date));
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setOpen(true);
              }
            }}
          />
        </HoverCardTrigger>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            id="date-picker"
            variant="default"
            size="icon-xs"
            aria-label="Select date"
            onClick={() => setOpen(!open)}
          >
            <CalendarIcon />
            <span className="sr-only">Select date</span>
          </InputGroupButton>
          <HoverCardContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={date}
              month={month}
              onMonthChange={setMonth}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDate(date);
                setValue(formatDate(date));
                setOpen(false);
                updateDateValue(formatDate(date));
              }}
            />
          </HoverCardContent>
        </InputGroupAddon>
      </InputGroup>
    </HoverCard>
  );
}
