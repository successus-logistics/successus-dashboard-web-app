"use client";

import * as React from "react";

import {
  AlertCircle,
  CalendarDays,
  Check,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  RefreshCw,
  Users,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type WindowStatus = "DRAFT" | "OPEN" | "CLOSED";
type SubmissionStatus = "SUBMITTED" | "NOT_SUBMITTED";
type RequestStatus = "PENDING" | "APPROVED" | "REJECTED";
type SubmissionViewMode = "week" | "month";

interface AvailabilityUser {
  id: number | string;
  username: string;
  display_name: string;
  email: string | null;
  is_active: boolean;
}
interface AvailabilityWindow {
  id: string;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  timezone: string;
  status: WindowStatus;
  opened_by: AvailabilityUser;
  opened_at: string | null;
}
interface AvailabilitySlot {
  id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  status: "AVAILABLE" | "WITHDRAWN";
  is_confirmed: boolean;
  assignment_id: string | null;
}
interface DashboardDriver {
  user: AvailabilityUser;
  submission_status: SubmissionStatus;
  slots: AvailabilitySlot[];
}
interface DashboardDay {
  date: string;
  is_open: boolean;
  available_count: number;
  confirmed_count: number;
}
interface DashboardResponse {
  window: AvailabilityWindow;
  summary: {
    active_drivers: number;
    submitted: number;
    not_submitted: number;
    available: number;
    confirmed: number;
    pending_requests: number;
  };
  days: DashboardDay[];
  drivers: DashboardDriver[];
}
interface ChangeRequest {
  id: string;
  assignment: { availability_slot: AvailabilitySlot; user: AvailabilityUser };
  requested_by: AvailabilityUser;
  request_type: "UNAVAILABLE" | "TIME_CHANGE";
  new_start_time: string | null;
  new_end_time: string | null;
  reason: string;
  status: RequestStatus;
  requested_at: string;
}
interface ApiErrorBody {
  detail?: string;
  dates?: string | string[];
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", options).format(new Date(`${value}T12:00:00`));
}
function getCurrentMonthKey() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
}
function formatDay(value: string) {
  return {
    short: formatDate(value, { weekday: "short" }),
    date: formatDate(value, { day: "2-digit", month: "short" }),
  };
}
function getMonthCalendarDates(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1, 12);
  const lastDay = new Date(year, month, 0, 12);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const dates: Array<string | null> = Array.from({ length: startOffset }, () => null);

  for (let day = 1; day <= lastDay.getDate(); day += 1) {
    dates.push(`${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`);
  }

  while (dates.length % 7 !== 0) dates.push(null);
  return dates;
}
function getMonthOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, "0");
    return { value: month, label: month };
  });
}
function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => String(currentYear - 2 + index));
}
function formatMonth(monthKey: string) {
  return formatDate(`${monthKey}-01`, { month: "long", year: "numeric" });
}
function addDays(value: string, amount: number) {
  const date = new Date(`${value}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
}
function getMonday(value: string) {
  const date = new Date(`${value}T12:00:00`);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  return date.toISOString().slice(0, 10);
}
function getTodayIsoDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function getWeekDates(weekStart: string) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}
function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}
function getErrorMessage(body: ApiErrorBody | unknown, fallback: string) {
  if (!body || typeof body !== "object") return fallback;
  const errorBody = body as ApiErrorBody;
  for (const value of [errorBody.detail, errorBody.dates])
    if (value) return Array.isArray(value) ? value.join(", ") : value;
  return fallback;
}

function getPreferredWindow(windows: AvailabilityWindow[]) {
  return windows.find((window) => window.status === "OPEN") ?? windows[0];
}

export function AvailabilityPage() {
  const [windows, setWindows] = React.useState<AvailabilityWindow[]>([]);
  const [selectedWindowId, setSelectedWindowId] = React.useState("");
  const [dashboard, setDashboard] = React.useState<DashboardResponse | null>(null);
  const [requests, setRequests] = React.useState<ChangeRequest[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [actionId, setActionId] = React.useState("");
  const [selectedSlotIds, setSelectedSlotIds] = React.useState<Set<string>>(() => new Set());
  const [submissionViewMode, setSubmissionViewMode] = React.useState<SubmissionViewMode>("week");
  const [submissionMonth, setSubmissionMonth] = React.useState("");
  const [submissionWeekStart, setSubmissionWeekStart] = React.useState("");
  const [selectedSubmissionDates, setSelectedSubmissionDates] = React.useState<Set<string>>(() => new Set());
  const [error, setError] = React.useState("");
  const [message, setMessage] = React.useState("");
  const selectedWindow = windows.find((window) => window.id === selectedWindowId) ?? null;

  React.useEffect(() => {
    if (selectedWindow) {
      setSubmissionMonth(getCurrentMonthKey());
      setSubmissionWeekStart(getMonday(getTodayIsoDate()));
      setSelectedSubmissionDates(new Set());
    }
  }, [selectedWindow]);

  const loadWindows = React.useCallback(async () => {
    const response = await fetch("/api/availability/windows", { cache: "no-store" });
    const body = (await response.json()) as AvailabilityWindow[] | ApiErrorBody;
    if (!response.ok) throw new Error(getErrorMessage(body, "Unable to load availability windows."));
    const result = Array.isArray(body) ? body : [];
    setWindows(result);
    setSelectedWindowId((current) =>
      current && result.some((window) => window.id === current) ? current : (getPreferredWindow(result)?.id ?? ""),
    );
    return result;
  }, []);

  const loadDashboard = React.useCallback(async (windowId: string) => {
    const [dashboardResponse, requestsResponse] = await Promise.all([
      fetch(`/api/availability/windows/${windowId}/dashboard`, { cache: "no-store" }),
      fetch(`/api/availability/change-requests?window=${windowId}&status=PENDING`, { cache: "no-store" }),
    ]);
    const dashboardBody = (await dashboardResponse.json()) as DashboardResponse | ApiErrorBody;
    const requestsBody = (await requestsResponse.json()) as ChangeRequest[] | ApiErrorBody;
    if (!dashboardResponse.ok)
      throw new Error(getErrorMessage(dashboardBody, "Unable to load availability dashboard."));
    if (!requestsResponse.ok) throw new Error(getErrorMessage(requestsBody, "Unable to load availability requests."));
    setDashboard(dashboardBody as DashboardResponse);
    setRequests(Array.isArray(requestsBody) ? requestsBody : []);
  }, []);

  const refresh = React.useCallback(
    async (showSpinner = true) => {
      if (showSpinner) setIsRefreshing(true);
      setError("");
      try {
        const result = await loadWindows();
        const windowId =
          selectedWindowId && result.some((window) => window.id === selectedWindowId)
            ? selectedWindowId
            : getPreferredWindow(result)?.id;
        if (windowId) await loadDashboard(windowId);
        else {
          setDashboard(null);
          setRequests([]);
        }
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unable to load availability data.");
      } finally {
        if (showSpinner) setIsRefreshing(false);
      }
    },
    [loadDashboard, loadWindows, selectedWindowId],
  );

  React.useEffect(() => {
    let cancelled = false;
    async function initialLoad() {
      try {
        const result = await loadWindows();
        const preferredWindow = getPreferredWindow(result);
        if (!cancelled && preferredWindow) await loadDashboard(preferredWindow.id);
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "Unable to load availability data.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }
    void initialLoad();
    return () => {
      cancelled = true;
    };
  }, [loadDashboard, loadWindows]);

  React.useEffect(() => {
    if (!selectedWindowId || isLoading) return;
    void loadDashboard(selectedWindowId).catch((loadError) =>
      setError(loadError instanceof Error ? loadError.message : "Unable to load availability data."),
    );
  }, [isLoading, loadDashboard, selectedWindowId]);

  const toggleSubmissionDate = (date: string) => {
    const selectedDay = dashboard?.days.find((day) => day.date === date);
    if (selectedDay?.is_open) return;
    setSelectedSubmissionDates((current) => {
      const next = new Set(current);
      if (next.has(date)) next.delete(date);
      else next.add(date);
      return next;
    });
  };

  const openSelectedDates = async () => {
    if (!selectedWindow || selectedSubmissionDates.size === 0) return;
    const dates = [...selectedSubmissionDates].sort();
    setActionId(`open-days-${dates.join(",")}`);
    setError("");
    try {
      for (const date of dates) {
        const response = await fetch(`/api/availability/windows/${selectedWindow.id}/days/${date}/open`, {
          method: "POST",
        });
        const body = (await response.json()) as AvailabilityWindow | ApiErrorBody;
        if (!response.ok) throw new Error(getErrorMessage(body, "Unable to open availability day."));
      }
      setSelectedSubmissionDates(new Set());
      setMessage(`${dates.length} date${dates.length === 1 ? "" : "s"} open for submissions.`);
      await refresh(false);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to open availability day.");
    } finally {
      setActionId("");
    }
  };

  const closeAvailabilityDate = async (date: string) => {
    if (!selectedWindow) return;
    const formattedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(`${date}T12:00:00`));
    if (!window.confirm(`Cancel availability for ${formattedDate}?`)) return;

    setActionId(`close-day-${date}`);
    setError("");
    try {
      const response = await fetch(`/api/availability/windows/${selectedWindow.id}/days/${date}/close`, {
        method: "POST",
      });
      const body = (await response.json()) as AvailabilityWindow | ApiErrorBody;
      if (!response.ok) throw new Error(getErrorMessage(body, "Unable to close availability day."));
      setSelectedSubmissionDates((current) => {
        const next = new Set(current);
        next.delete(date);
        return next;
      });
      setMessage(`${formattedDate} is no longer open for submissions.`);
      await refresh(false);
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Unable to close availability day.");
    } finally {
      setActionId("");
    }
  };

  const toggleSlot = (slotId: string) => {
    setSelectedSlotIds((current) => {
      const next = new Set(current);
      if (next.has(slotId)) next.delete(slotId);
      else next.add(slotId);
      return next;
    });
  };

  const confirmDriver = async (slotIds: string[]) => {
    if (!slotIds.length) return;
    setActionId(`assign-${slotIds.join(",")}`);
    setError("");
    try {
      const response = await fetch("/api/availability/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slot_ids: slotIds }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(body, "Unable to confirm driver availability."));
      setMessage("Selected availability confirmed.");
      setSelectedSlotIds((current) => {
        const next = new Set(current);
        slotIds.forEach((slotId) => {
          next.delete(slotId);
        });
        return next;
      });
      if (selectedWindowId) await loadDashboard(selectedWindowId);
    } catch (assignError) {
      setError(assignError instanceof Error ? assignError.message : "Unable to confirm driver availability.");
    } finally {
      setActionId("");
    }
  };

  const decideRequest = async (requestId: string, decision: "APPROVED" | "REJECTED") => {
    setActionId(requestId);
    setError("");
    try {
      const response = await fetch(`/api/availability/change-requests/${requestId}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(getErrorMessage(body, "Unable to review availability request."));
      setMessage(`Request ${decision === "APPROVED" ? "approved" : "rejected"}.`);
      if (selectedWindowId) await loadDashboard(selectedWindowId);
      setRequests((current) => current.filter((request) => request.id !== requestId));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to review availability request.");
    } finally {
      setActionId("");
    }
  };

  if (isLoading) return <LoadingState label="Loading availability data…" />;
  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <PageHeader isRefreshing={isRefreshing} onRefresh={() => void refresh()} />
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-3 text-emerald-700 text-sm dark:text-emerald-400">
          {message}
        </div>
      )}
      {!selectedWindow || !dashboard ? (
        <EmptyState />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <SummaryCard icon={Users} label="Active drivers" value={dashboard.summary.active_drivers} />
            <SummaryCard
              icon={CheckCircle2}
              label="Available driver"
              value={dashboard.summary.available}
              tone="success"
            />
            <SummaryCard
              icon={AlertCircle}
              label="Unconfirmed"
              value={dashboard.summary.not_submitted}
              tone="warning"
            />
            <SummaryCard
              icon={Clock3}
              label="Pending requests"
              value={dashboard.summary.pending_requests}
              tone="info"
            />
          </div>
          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
            <DriverTable
              drivers={dashboard.drivers}
              days={dashboard.days}
              viewMode={submissionViewMode}
              selectedMonth={submissionMonth || getCurrentMonthKey()}
              onViewModeChange={setSubmissionViewMode}
              onMonthChange={setSubmissionMonth}
              weekStart={submissionWeekStart || getMonday(getTodayIsoDate())}
              onWeekChange={setSubmissionWeekStart}
              selectedDates={selectedSubmissionDates}
              onDateSelect={toggleSubmissionDate}
              onCloseDate={(date) => void closeAvailabilityDate(date)}
              onOpenDate={() => void openSelectedDates()}
              onConfirm={confirmDriver}
              selectedSlotIds={selectedSlotIds}
              onToggleSlot={toggleSlot}
              actionId={actionId}
            />
            <RequestList requests={requests} onDecision={decideRequest} actionId={actionId} />
          </div>
        </>
      )}
    </div>
  );
}

function PageHeader({ isRefreshing, onRefresh }: { isRefreshing: boolean; onRefresh: () => void }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
          <CalendarDays className="size-4" />
          <span>Driver planning</span>
          <span aria-hidden="true">/</span>
          <span>Manager view</span>
        </div>
        <h1 className="text-3xl tracking-tight">Driver availability</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
          Review availability before building the driver rota.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing} aria-label="Refresh availability">
        <RefreshCw className={isRefreshing ? "animate-spin" : ""} data-icon="inline-start" />
        Refresh
      </Button>
    </div>
  );
}

function DriverTable({
  drivers,
  days,
  viewMode,
  selectedMonth,
  onViewModeChange,
  onMonthChange,
  weekStart,
  onWeekChange,
  selectedDates,
  onDateSelect,
  onCloseDate,
  onOpenDate,
  onConfirm,
  selectedSlotIds,
  onToggleSlot,
  actionId,
}: {
  drivers: DashboardDriver[];
  days: DashboardDay[];
  viewMode: SubmissionViewMode;
  selectedMonth: string;
  onViewModeChange: (mode: SubmissionViewMode) => void;
  onMonthChange: (month: string) => void;
  weekStart: string;
  onWeekChange: (date: string) => void;
  selectedDates: Set<string>;
  onDateSelect: (date: string) => void;
  onCloseDate: (date: string) => void;
  onOpenDate: () => void;
  onConfirm: (slotIds: string[]) => void;
  selectedSlotIds: Set<string>;
  onToggleSlot: (slotId: string) => void;
  actionId: string;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Driver submissions</CardTitle>
            <CardDescription>Availability returned from the database.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            {viewMode === "month" ? (
              <MonthSubmissionControls
                selectedMonth={selectedMonth}
                hasSelection={selectedDates.size > 0}
                onMonthChange={onMonthChange}
                onOpenDate={onOpenDate}
              />
            ) : (
              <WeekNavigation weekStart={weekStart} onWeekChange={onWeekChange} />
            )}
            <fieldset className="flex shrink-0 rounded-lg border bg-muted/30 p-1">
              <legend className="sr-only">Submission view</legend>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "month" ? "default" : "ghost"}
                onClick={() => onViewModeChange("month")}
              >
                Month
              </Button>
              <Button
                type="button"
                size="sm"
                variant={viewMode === "week" ? "default" : "ghost"}
                onClick={() => onViewModeChange("week")}
              >
                Week
              </Button>
            </fieldset>
          </div>
        </div>
      </CardHeader>
      {viewMode === "month" ? (
        <DriverMonthCalendar
          days={days}
          selectedMonth={selectedMonth}
          selectedDates={selectedDates}
          onDateSelect={onDateSelect}
          onCloseDate={onCloseDate}
        />
      ) : (
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  {getWeekDates(weekStart).map((date) => {
                    const day = days.find((item) => item.date === date) ?? {
                      date,
                      is_open: false,
                      available_count: 0,
                      confirmed_count: 0,
                    };
                    const label = formatDay(day.date);
                    return (
                      <TableHead
                        key={day.date}
                        className={`text-center ${day.is_open ? "" : "bg-muted/30 text-muted-foreground/60"}`}
                      >
                        <span className="block">{label.short}</span>
                        <span className="font-normal text-muted-foreground text-xs">{label.date}</span>
                      </TableHead>
                    );
                  })}
                  <TableHead>Status</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {drivers.map((driver) => (
                  <DriverRow
                    key={driver.user.id}
                    driver={driver}
                    days={getWeekDates(weekStart).map(
                      (date) =>
                        days.find((item) => item.date === date) ?? {
                          date,
                          is_open: false,
                          available_count: 0,
                          confirmed_count: 0,
                        },
                    )}
                    onConfirm={onConfirm}
                    selectedSlotIds={selectedSlotIds}
                    onToggleSlot={onToggleSlot}
                    actionId={actionId}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

function MonthSubmissionControls({
  selectedMonth,
  hasSelection,
  onMonthChange,
  onOpenDate,
}: {
  selectedMonth: string;
  hasSelection: boolean;
  onMonthChange: (month: string) => void;
  onOpenDate: () => void;
}) {
  const year = selectedMonth.slice(0, 4);
  const month = selectedMonth.slice(5, 7);
  return (
    <div className="flex gap-2">
      <Button type="button" size="sm" onClick={onOpenDate} disabled={!hasSelection}>
        Open
      </Button>
      <Select value={year} onValueChange={(value) => onMonthChange(`${value}-${month}`)}>
        <SelectTrigger className="w-28" aria-label="Choose year">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getYearOptions().map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={month} onValueChange={(value) => onMonthChange(`${year}-${value}`)}>
        <SelectTrigger className="w-24" aria-label="Choose month">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {getMonthOptions().map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function WeekNavigation({ weekStart, onWeekChange }: { weekStart: string; onWeekChange: (date: string) => void }) {
  return (
    <div className="flex gap-2">
      <Button type="button" size="sm" variant="outline" onClick={() => onWeekChange(addDays(weekStart, -7))}>
        Previous week
      </Button>
      <Button type="button" size="sm" variant="outline" onClick={() => onWeekChange(addDays(weekStart, 7))}>
        Next week
      </Button>
    </div>
  );
}

function DriverMonthCalendar({
  days,
  selectedMonth,
  selectedDates,
  onDateSelect,
  onCloseDate,
}: {
  days: DashboardDay[];
  selectedMonth: string;
  selectedDates: Set<string>;
  onDateSelect: (date: string) => void;
  onCloseDate: (date: string) => void;
}) {
  const daysByDate = new Map(days.map((day) => [day.date, day]));
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <CardContent className="p-3 sm:p-4">
      <h3 className="mb-3 text-center font-heading text-lg">{formatMonth(selectedMonth)}</h3>
      <div className="grid grid-cols-7 gap-1.5">
        {weekdayLabels.map((label) => (
          <div key={label} className="pb-1 text-center font-medium text-muted-foreground text-xs">
            {label}
          </div>
        ))}
        {getMonthCalendarDates(selectedMonth).map((date, index) => {
          const day = date ? daysByDate.get(date) : undefined;
          const cellClass = `relative min-h-24 rounded-lg border p-2 text-left transition-colors ${
            day?.is_open ? "border-sky-500/30 bg-sky-500/10" : "border-border/60 bg-muted/30 text-muted-foreground/55"
          } ${selectedDates.has(date ?? "") ? "ring-2 ring-red-500 ring-offset-1" : ""}`;
          return (
            <div key={date ?? `empty-${index}`} className={cellClass}>
              <button
                type="button"
                disabled={!date || day?.is_open === true}
                onClick={() => date && !day?.is_open && onDateSelect(date)}
                className="absolute inset-0 rounded-lg p-2 text-left disabled:cursor-default"
                aria-label={
                  date
                    ? `${formatDate(date, { weekday: "long", day: "numeric", month: "long" })}: ${day?.is_open ? "open" : "not open"}`
                    : undefined
                }
              >
                {date && (
                  <>
                    <p className="font-medium text-sm">{formatDate(date, { day: "numeric" })}</p>
                    {day?.is_open ? (
                      <div className="mt-3 space-y-1 text-xs">
                        <p className="text-sky-700 dark:text-sky-300">{day.available_count} available</p>
                        <p className="text-muted-foreground">{day.confirmed_count} confirmed</p>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs">Not open</p>
                    )}
                  </>
                )}
              </button>
              {date && day?.is_open && (
                <button
                  type="button"
                  className="absolute top-1 right-1 z-10 flex size-6 items-center justify-center rounded-full text-sky-700 hover:bg-sky-500/20 dark:text-sky-300"
                  aria-label={`Cancel opening for ${formatDate(date, { weekday: "long", day: "numeric", month: "long" })}`}
                  onClick={() => onCloseDate(date)}
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          );
        })}
      </div>
    </CardContent>
  );
}

function DriverRow({
  driver,
  days,
  onConfirm,
  selectedSlotIds,
  onToggleSlot,
  actionId,
}: {
  driver: DashboardDriver;
  days: DashboardDay[];
  onConfirm: (slotIds: string[]) => void;
  selectedSlotIds: Set<string>;
  onToggleSlot: (slotId: string) => void;
  actionId: string;
}) {
  const slotsByDate = new Map(driver.slots.map((slot) => [slot.date, slot]));
  const openDates = new Set(days.filter((day) => day.is_open).map((day) => day.date));
  const selectedDriverSlots = driver.slots.filter((slot) => selectedSlotIds.has(slot.id) && openDates.has(slot.date));
  return (
    <TableRow className={driver.submission_status === "NOT_SUBMITTED" ? "bg-muted/30" : undefined}>
      <TableCell>
        <p className="font-medium">{driver.user.display_name}</p>
        <p className="text-muted-foreground text-xs">{driver.user.email ?? driver.user.username}</p>
      </TableCell>
      {days.map((day) => (
        <TableCell
          key={`${driver.user.id}-${day.date}`}
          className={`text-center ${day.is_open ? "" : "bg-muted/30 text-muted-foreground/60"}`}
        >
          <AvailabilityMark
            slot={slotsByDate.get(day.date)}
            isOpen={day.is_open}
            submitted={driver.submission_status === "SUBMITTED"}
            selected={slotsByDate.get(day.date) ? selectedSlotIds.has(slotsByDate.get(day.date)?.id ?? "") : false}
            onToggle={onToggleSlot}
          />
        </TableCell>
      ))}
      <TableCell>
        <Badge variant={driver.submission_status === "SUBMITTED" ? "secondary" : "destructive"}>
          {driver.submission_status === "SUBMITTED" ? "Submitted" : "Not submitted"}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          size="sm"
          onClick={() => onConfirm(selectedDriverSlots.map((slot) => slot.id))}
          disabled={selectedDriverSlots.length === 0 || actionId.startsWith("assign-")}
        >
          Confirm
        </Button>
      </TableCell>
    </TableRow>
  );
}

function RequestList({
  requests,
  onDecision,
  actionId,
}: {
  requests: ChangeRequest[];
  onDecision: (id: string, decision: "APPROVED" | "REJECTED") => void;
  actionId: string;
}) {
  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>Availability requests</CardTitle>
        <CardDescription>Review changes submitted by drivers.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 p-3 sm:p-4">
        {requests.length === 0 ? (
          <p className="rounded-lg bg-muted/50 p-3 text-muted-foreground text-sm">No pending requests.</p>
        ) : (
          requests.map((request) => (
            <div key={request.id} className="rounded-lg border p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-sm">{request.requested_by.display_name}</p>
                  <p className="text-muted-foreground text-xs">{formatDateTime(request.requested_at)}</p>
                </div>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <p className="mt-3 text-sm">
                {request.request_type === "UNAVAILABLE" ? "Unavailable request" : "Time change request"}
              </p>
              <p className="mt-1 text-muted-foreground text-xs">{request.reason}</p>
              <div className="mt-3 flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => onDecision(request.id, "APPROVED")}
                  disabled={actionId === request.id}
                >
                  <Check data-icon="inline-start" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => onDecision(request.id, "REJECTED")}
                  disabled={actionId === request.id}
                >
                  <X data-icon="inline-start" />
                  Reject
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "default",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  detail?: string;
  tone?: "default" | "success" | "warning" | "info";
}) {
  const toneClass = {
    default: "",
    success: "text-emerald-600 dark:text-emerald-400",
    warning: "text-amber-600 dark:text-amber-400",
    info: "text-sky-600 dark:text-sky-400",
  }[tone];
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription className="flex items-center gap-2">
          <Icon className="size-4" />
          {label}
        </CardDescription>
        <CardTitle className={`text-2xl ${toneClass}`}>{value}</CardTitle>
      </CardHeader>
      {detail && (
        <CardContent>
          <p className="text-muted-foreground text-xs">{detail}</p>
        </CardContent>
      )}
    </Card>
  );
}

function AvailabilityMark({
  slot,
  isOpen,
  submitted,
  selected,
  onToggle,
}: {
  slot: AvailabilitySlot | undefined;
  isOpen: boolean;
  submitted: boolean;
  selected: boolean;
  onToggle: (slotId: string) => void;
}) {
  if (!isOpen || !submitted || !slot) return <span className="text-muted-foreground">-</span>;
  if (slot.is_confirmed)
    return (
      <span className="mx-auto flex size-6 items-center justify-center rounded-full bg-emerald-500 text-white">
        <Check className="size-4" />
      </span>
    );
  return (
    <button
      type="button"
      className={`mx-auto flex size-7 items-center justify-center rounded-full transition-colors ${selected ? "bg-foreground text-background" : "bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/30 dark:text-emerald-400"}`}
      aria-label={`${selected ? "Deselect" : "Select"} ${formatDay(slot.date).date}`}
      aria-pressed={selected}
      onClick={() => onToggle(slot.id)}
    >
      <Check className="size-4" />
    </button>
  );
}

function EmptyState() {
  return (
    <Card>
      <CardContent className="flex min-h-52 flex-col items-center justify-center gap-3 p-6 text-center">
        <CalendarDays className="size-8 text-muted-foreground" />
        <div>
          <p className="font-medium">No availability window selected</p>
          <p className="mt-1 max-w-md text-muted-foreground text-sm">
            Create and open a window above to collect driver availability.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex min-h-64 items-center justify-center gap-2 text-muted-foreground text-sm">
      <LoaderCircle className="size-4 animate-spin" />
      {label}
    </div>
  );
}
