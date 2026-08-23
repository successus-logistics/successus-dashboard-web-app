import type { TimesheetSubmission } from "./_components/data";
import { TimesheetKpiCards } from "./_components/timesheet-kpi-cards";
import { TimesheetSubmissions } from "./_components/timesheet-submissions";
import { apiFetch } from "@/lib/auth/client";

async function getTimesheets(): Promise<TimesheetSubmission[]> {
  const response = await apiFetch<TimesheetSubmission[]>("/api/timesheets/");
  return response;
}

export default async function TimesheetsPage() {
  const timesheets = await getTimesheets();

  return (
    <div className="flex flex-col gap-4 md:gap-6">
      <TimesheetKpiCards />
      <TimesheetSubmissions timesheets={timesheets} />
    </div>
  );
}
