"use client";

import * as React from "react";

import { CalendarDays, Check, CheckCircle2, Clock3, Info, LoaderCircle, RefreshCw, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

type DayStatus = "available" | "unavailable" | "confirmed" | "pending";

interface AvailabilityWindow {
  id: string;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  timezone: string;
  status: "DRAFT" | "OPEN" | "CLOSED";
  opened_by: AvailabilityUser;
  opened_at: string | null;
  days?: AvailabilityWindowDay[];
}

interface AvailabilityWindowDay {
  id: string;
  date: string;
  status: "DRAFT" | "OPEN" | "CLOSED";
  opened_at: string | null;
  closed_at: string | null;
}

interface AvailabilityUser {
  id: number | string;
  username: string;
  display_name: string;
  email: string | null;
  is_active: boolean;
}

interface AvailabilitySlot {
  id: string;
  date: string;
  start_time: string | null;
  end_time: string | null;
  is_all_day: boolean;
  status: "AVAILABLE" | "WITHDRAWN";
  is_confirmed: boolean;
  assignment_id: string | null;
}

interface AvailabilityResponse {
  window: AvailabilityWindow;
  slots: AvailabilitySlot[];
}

interface AvailabilityDay {
  date: string;
  weekday: string;
  number: string;
  status: DayStatus;
  selected: boolean;
  assignmentId: string | null;
}

interface AvailabilityChangeRequest {
  id: string;
  assignment: { id: string; availability_slot: AvailabilitySlot };
  status: "PENDING" | "APPROVED" | "REJECTED";
}

interface ApiErrorBody {
  detail?: string;
  dates?: string | string[];
  window?: string | string[];
}

function parseDate(value: string) {
  return new Date(`${value}T12:00:00`);
}

function formatDate(value: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-GB", options).format(parseDate(value));
}

function formatWorkingHours(window: AvailabilityWindow) {
  if (window.is_all_day || (window.start_time === null && window.end_time === null)) return "00:00 – 24:00";
  return `${window.start_time?.slice(0, 5)} – ${window.end_time?.slice(0, 5)}`;
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

function getMonthParts(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return { year, month };
}

function getMonthOptions() {
  return Array.from({ length: 12 }, (_, index) => {
    const month = String(index + 1).padStart(2, "0");
    return {
      value: month,
      label: month,
    };
  });
}

function getYearOptions() {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => String(currentYear - 2 + index));
}

function getCurrentWeekDates() {
  const today = new Date();
  const monday = new Date(today);
  const day = monday.getDay();
  monday.setDate(monday.getDate() - (day === 0 ? 6 : day - 1));
  const toIsoDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateNumber = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${dateNumber}`;
  };
  return { weekStart: toIsoDate(monday) };
}

function toUnavailableDays() {
  const { weekStart } = getCurrentWeekDates();
  const dates = Array.from({ length: 7 }, (_, index) => {
    const current = parseDate(weekStart);
    current.setDate(current.getDate() + index);
    return current.toISOString().slice(0, 10);
  });
  return dates.map((date) => ({
    date,
    weekday: formatDate(date, { weekday: "long" }),
    number: formatDate(date, { day: "numeric" }),
    status: "unavailable" as const,
    selected: false,
    assignmentId: null,
  }));
}

function toAvailabilityDays(
  window: AvailabilityWindow,
  slots: AvailabilitySlot[],
  pendingAssignmentIds: Set<string> = new Set(),
): AvailabilityDay[] {
  const slotByDate = new Map(slots.map((slot) => [slot.date, slot]));
  const dates = [...new Set([...(window.days ?? []).map((day) => day.date), ...slots.map((slot) => slot.date)])].sort();
  const openDates = new Set((window.days ?? []).filter((day) => day.status === "OPEN").map((day) => day.date));
  return dates.map((date) => {
    const slot = slotByDate.get(date);
    const isOpen = openDates.has(date);
    const isPending = slot?.assignment_id ? pendingAssignmentIds.has(slot.assignment_id) : false;
    let status: DayStatus = isOpen ? "available" : "unavailable";
    if (isOpen && isPending) status = "pending";
    else if (isOpen && slot?.is_confirmed) status = "confirmed";
    return {
      date,
      weekday: formatDate(date, { weekday: "long" }),
      number: formatDate(date, { day: "numeric" }),
      status,
      selected: isOpen && slot?.status === "AVAILABLE",
      assignmentId: slot?.assignment_id ?? null,
    };
  });
}

export function DriverAvailabilityPage() {
  const [windows, setWindows] = React.useState<AvailabilityWindow[]>([]);
  const [selectedWindowId, setSelectedWindowId] = React.useState("");
  const [availability, setAvailability] = React.useState<AvailabilityResponse | null>(null);
  const [days, setDays] = React.useState<AvailabilityDay[]>([]);
  const [isLoadingWindows, setIsLoadingWindows] = React.useState(true);
  const [isLoadingAvailability, setIsLoadingAvailability] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [selectedMonth, setSelectedMonth] = React.useState("");
  const [selectedCalendarDate, setSelectedCalendarDate] = React.useState<string | null>(null);
  const [selectedConfirmedDay, setSelectedConfirmedDay] = React.useState<AvailabilityDay | null>(null);
  const [changeReason, setChangeReason] = React.useState("");
  const [isSubmittingChange, setIsSubmittingChange] = React.useState(false);
  const [error, setError] = React.useState("");
  const [saveMessage, setSaveMessage] = React.useState("");

  const selectedWindow = windows.find((window) => window.id === selectedWindowId) ?? null;
  const currentMonth =
    selectedMonth || new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit" }).format(new Date());
  const currentMonthDays = days.filter((day) => day.date.startsWith(currentMonth));
  const currentMonthOpenDates = currentMonthDays.filter((day) => day.status !== "unavailable").length;
  const currentMonthSelectedDays = currentMonthDays.filter((day) => day.selected).length;
  const currentMonthConfirmedDays = currentMonthDays.filter((day) => day.status === "confirmed").length;
  const currentMonthPendingDays = currentMonthDays.filter((day) => day.status === "pending").length;
  let currentMonthAvailableDetail = "Ready to submit";
  if (currentMonthPendingDays) currentMonthAvailableDetail = `${currentMonthPendingDays} awaiting approval`;
  if (currentMonthConfirmedDays) currentMonthAvailableDetail = `${currentMonthConfirmedDays} confirmed by manager`;

  const loadWindows = React.useCallback(async () => {
    setIsLoadingWindows(true);
    setError("");
    try {
      const response = await fetch("/api/availability/windows", { cache: "no-store" });
      const body = (await response.json()) as AvailabilityWindow[] | ApiErrorBody;
      if (!response.ok) throw new Error(getApiErrorMessage(body, "Unable to load open availability windows."));
      const openWindows = Array.isArray(body) ? body : [];
      setWindows(openWindows);
      setSelectedWindowId((currentId) =>
        openWindows.some((window) => window.id === currentId) ? currentId : getPreferredWindow(openWindows)?.id || "",
      );
      if (openWindows.length === 0) setDays(toUnavailableDays());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load availability windows.");
    } finally {
      setIsLoadingWindows(false);
    }
  }, []);

  React.useEffect(() => {
    void loadWindows();
  }, [loadWindows]);

  const loadAvailability = React.useCallback(async () => {
    if (!selectedWindowId) {
      setAvailability(null);
      setDays([]);
      return;
    }

    setIsLoadingAvailability(true);
    setError("");
    setSaveMessage("");
    try {
      const [availabilityResponse, requestsResponse] = await Promise.all([
        fetch(`/api/availability/windows/${selectedWindowId}/my-availability`, { cache: "no-store" }),
        fetch(`/api/availability/change-requests/mine?window=${selectedWindowId}&status=PENDING`, {
          cache: "no-store",
        }),
      ]);
      const body = (await availabilityResponse.json()) as AvailabilityResponse | ApiErrorBody;
      const requestsBody = (await requestsResponse.json()) as AvailabilityChangeRequest[] | ApiErrorBody;
      if (!availabilityResponse.ok) throw new Error(getApiErrorMessage(body, "Unable to load your availability."));
      if (!requestsResponse.ok)
        throw new Error(getApiErrorMessage(requestsBody, "Unable to load your change requests."));

      const result = body as AvailabilityResponse;
      const pendingRequests = Array.isArray(requestsBody) ? requestsBody : [];
      const pendingAssignmentIds = new Set(pendingRequests.map((request) => request.assignment.id));
      setAvailability(result);
      setSelectedMonth(
        (currentMonth) =>
          currentMonth || new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit" }).format(new Date()),
      );
      setDays(toAvailabilityDays(result.window, result.slots, pendingAssignmentIds));
      setSelectedConfirmedDay((currentDay) => {
        if (!currentDay) return null;
        return pendingAssignmentIds.has(currentDay.assignmentId ?? "") ? null : currentDay;
      });
    } catch (loadError) {
      setAvailability(null);
      setDays([]);
      setError(loadError instanceof Error ? loadError.message : "Unable to load your availability.");
    } finally {
      setIsLoadingAvailability(false);
    }
  }, [selectedWindowId]);

  React.useEffect(() => {
    void loadAvailability();
  }, [loadAvailability]);

  const refresh = async () => {
    setIsRefreshing(true);
    setSelectedCalendarDate(null);
    setSelectedConfirmedDay(null);
    setChangeReason("");
    try {
      await loadWindows();
      await loadAvailability();
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleDay = (date: string) => {
    setDays((currentDays) =>
      currentDays.map((day) =>
        day.date === date && day.status === "available" ? { ...day, selected: !day.selected } : day,
      ),
    );
    setSaveMessage("");
  };

  const submitAvailability = async () => {
    if (!selectedWindowId) return;
    setIsSaving(true);
    setError("");
    setSaveMessage("");

    try {
      const response = await fetch(`/api/availability/windows/${selectedWindowId}/my-availability`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dates: days.filter((day) => day.selected).map((day) => day.date) }),
      });
      const body = (await response.json()) as AvailabilityResponse | ApiErrorBody;
      if (!response.ok) throw new Error(getApiErrorMessage(body, "Unable to save your availability."));

      await loadAvailability();
      setSaveMessage("Availability saved successfully.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Unable to save your availability.");
    } finally {
      setIsSaving(false);
    }
  };

  const submitChangeRequest = async () => {
    if (!selectedConfirmedDay?.assignmentId || !changeReason.trim()) return;
    setIsSubmittingChange(true);
    setError("");
    setSaveMessage("");
    try {
      const response = await fetch(
        `/api/availability/assignments/${selectedConfirmedDay.assignmentId}/change-requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ request_type: "UNAVAILABLE", reason: changeReason.trim() }),
        },
      );
      const body = (await response.json()) as AvailabilityChangeRequest | ApiErrorBody;
      if (!response.ok) throw new Error(getApiErrorMessage(body, "Unable to submit the change request."));
      setSelectedConfirmedDay(null);
      setChangeReason("");
      await loadAvailability();
      setSaveMessage("Change request submitted for manager approval.");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit the change request.");
    } finally {
      setIsSubmittingChange(false);
    }
  };

  const selectedCalendarDay = days.find((day) => day.date === selectedCalendarDate) ?? null;

  if (isLoadingWindows) return <LoadingState label="Loading open availability windows…" />;

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <PageHeader isRefreshing={isRefreshing} onRefresh={refresh} />

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-destructive text-sm">
          {error}
        </div>
      )}

      {!selectedWindow || !availability ? (
        <UnavailableCalendar days={days} />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3">
            <SummaryCard
              icon={CalendarDays}
              label="Open dates"
              value={currentMonthOpenDates}
              detail={formatMonthRange(currentMonth)}
            />
            <SummaryCard
              icon={CheckCircle2}
              label="My available days"
              value={currentMonthSelectedDays}
              detail={currentMonthAvailableDetail}
              tone="success"
            />
            <SummaryCard
              icon={Clock3}
              label="Availability"
              value="All day"
              detail={formatWorkingHours(selectedWindow)}
              tone="info"
            />
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]">
            <Card className="min-w-0">
              <CardContent className="p-3 sm:p-5">
                {isLoadingAvailability ? (
                  <LoadingState label="Loading your dates…" compact />
                ) : (
                  <AvailabilityMonthCalendar
                    days={days}
                    selectedMonth={currentMonth}
                    onMonthChange={setSelectedMonth}
                    onToggle={(date) => {
                      setSelectedCalendarDate(date);
                      toggleDay(date);
                    }}
                    onSelectDay={(day, date) => {
                      setSelectedCalendarDate(day?.date ?? date ?? null);
                      if (day?.status === "confirmed") setSelectedConfirmedDay(day);
                    }}
                    selectedConfirmedDate={selectedConfirmedDay?.date ?? null}
                    onSave={submitAvailability}
                    isSaving={isSaving}
                    isLoading={isLoadingAvailability}
                  />
                )}

                {saveMessage && (
                  <div className="mt-5 border-t pt-4">
                    <p className="text-emerald-600 text-xs dark:text-emerald-400">{saveMessage}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <AvailabilityDetailsCard
              selectedDate={selectedCalendarDate}
              selectedDay={selectedCalendarDay}
              window={selectedWindow}
            />
          </div>
          <Dialog
            open={Boolean(selectedConfirmedDay)}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedConfirmedDay(null);
                setChangeReason("");
              }
            }}
          >
            <DialogContent
              onPointerDownOutside={(event) => event.preventDefault()}
              onInteractOutside={(event) => event.preventDefault()}
              onEscapeKeyDown={(event) => event.preventDefault()}
            >
              <DialogHeader>
                <DialogTitle>Need to change a confirmed day?</DialogTitle>
                <DialogDescription>
                  Request cancellation for {selectedConfirmedDay?.weekday} {selectedConfirmedDay?.number}.
                </DialogDescription>
              </DialogHeader>
              <Textarea
                value={changeReason}
                onChange={(event) => setChangeReason(event.target.value)}
                placeholder="Explain why you need to become unavailable…"
                aria-label="Reason for changing confirmed availability"
              />
              <Button disabled={isSubmittingChange || !changeReason.trim()} onClick={submitChangeRequest}>
                {isSubmittingChange ? (
                  <LoaderCircle data-icon="inline-start" className="animate-spin" />
                ) : (
                  <Send data-icon="inline-start" />
                )}
                {isSubmittingChange ? "Submitting…" : "Request cancellation"}
              </Button>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}

function AvailabilityDetailsCard({
  selectedDate,
  selectedDay,
  window,
}: {
  selectedDate: string | null;
  selectedDay: AvailabilityDay | null;
  window: AvailabilityWindow;
}) {
  if (selectedDate === null) {
    return (
      <Card className="min-w-0">
        <CardContent className="flex min-h-48 flex-col items-center justify-center gap-2 p-5 text-center">
          <CalendarDays className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-sm">Select a date to view open availability</p>
          <p className="text-muted-foreground text-xs">Choose a calendar date to view its availability details.</p>
        </CardContent>
      </Card>
    );
  }

  if (selectedDay === null) {
    return (
      <Card className="min-w-0">
        <CardContent className="flex min-h-48 flex-col items-center justify-center gap-2 p-5 text-center">
          <CalendarDays className="size-8 text-muted-foreground/50" />
          <p className="font-medium text-sm">No work is open on this day</p>
          <p className="text-muted-foreground text-xs">Choose an open date to submit availability.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="min-w-0">
      <CardHeader className="border-b">
        <CardTitle>Submission details</CardTitle>
        <CardDescription>
          {selectedDay.weekday} {selectedDay.number}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3 rounded-lg border border-emerald-500/25 bg-emerald-500/5 p-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
            <Check className="size-4" />
          </div>
          <div>
            <p className="font-medium text-sm">{getDayDetailLabel(selectedDay)}</p>
            <p className="mt-0.5 text-muted-foreground text-xs">{getDayDetailDescription(selectedDay)}</p>
          </div>
        </div>

        <div className="space-y-3">
          <StatusRow label="Opened by" value={window.opened_by.display_name} />
          <StatusRow label="Opened" value={window.opened_at ? formatDateTime(window.opened_at) : "Not specified"} />
          <StatusRow label="Working hours" value={formatWorkingHours(window)} />
          <StatusRow label="Timezone" value={window.timezone} />
        </div>

        <Separator />

        <div className="flex items-start gap-2 text-muted-foreground text-xs">
          <Info className="mt-0.5 size-4 shrink-0" />
          <p>You can update unconfirmed days while the manager&apos;s availability window remains open.</p>
        </div>
      </CardContent>
    </Card>
  );
}

function getApiErrorMessage(body: unknown, fallback: string) {
  if (!body || typeof body !== "object") return fallback;
  const errorBody = body as ApiErrorBody;
  if (errorBody.detail) return Array.isArray(errorBody.detail) ? errorBody.detail.join(", ") : errorBody.detail;
  if (errorBody.dates) return Array.isArray(errorBody.dates) ? errorBody.dates.join(", ") : errorBody.dates;
  if (errorBody.window) return Array.isArray(errorBody.window) ? errorBody.window.join(", ") : errorBody.window;
  return fallback;
}

function getPreferredWindow(windows: AvailabilityWindow[]) {
  return windows.find((window) => window.status === "OPEN") ?? windows[0];
}

function PageHeader({ isRefreshing, onRefresh }: { isRefreshing: boolean; onRefresh: () => void }) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <div className="mb-2 flex items-center gap-2 text-muted-foreground text-sm">
          <CalendarDays className="size-4" />
          <span>Driver planning</span>
          <span aria-hidden="true">/</span>
          <span>My availability</span>
        </div>
        <h1 className="text-3xl tracking-tight">Availability-D</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground text-sm">
          Tell your manager which days you are available to work.
        </p>
      </div>
      <div className="flex items-center">
        <Button type="button" variant="outline" size="sm" onClick={onRefresh} disabled={isRefreshing}>
          <RefreshCw data-icon="inline-start" className={isRefreshing ? "animate-spin" : undefined} />
          Refresh
        </Button>
      </div>
    </div>
  );
}

function AvailabilityMonthCalendar({
  days,
  selectedMonth,
  onMonthChange,
  onToggle,
  onSelectDay,
  selectedConfirmedDate,
  onSave,
  isSaving,
  isLoading,
}: {
  days: AvailabilityDay[];
  selectedMonth: string;
  onMonthChange: (month: string) => void;
  onToggle: (date: string) => void;
  onSelectDay: (day: AvailabilityDay | null, date?: string) => void;
  selectedConfirmedDate: string | null;
  onSave: () => void;
  isSaving: boolean;
  isLoading: boolean;
}) {
  const daysByDate = new Map(days.map((day) => [day.date, day]));
  const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const { year, month } = getMonthParts(selectedMonth);

  return (
    <div className="overflow-hidden rounded-xl border bg-muted/10">
      <div className="flex flex-col gap-3 border-b bg-background px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-medium text-sm">Availability calendar</p>
          <p className="text-muted-foreground text-xs">Maintain your availability.</p>
        </div>
        <div className="flex flex-wrap gap-2 sm:justify-end">
          <Select
            value={String(year)}
            onValueChange={(value) => onMonthChange(`${value}-${String(month).padStart(2, "0")}`)}
          >
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
          <Select value={String(month).padStart(2, "0")} onValueChange={(value) => onMonthChange(`${year}-${value}`)}>
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
          <Button type="button" disabled={isSaving || isLoading} onClick={onSave}>
            {isSaving ? (
              <LoaderCircle data-icon="inline-start" className="animate-spin" />
            ) : (
              <Send data-icon="inline-start" />
            )}
            {isSaving ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <section aria-label={formatMonth(selectedMonth)}>
          <h3 className="mb-3 text-center font-heading text-lg">{formatMonth(selectedMonth)}</h3>
          <div className="grid grid-cols-7 gap-1.5">
            {weekdayLabels.map((label) => (
              <div key={label} className="pb-1 text-center font-medium text-muted-foreground text-xs">
                {label}
              </div>
            ))}
            {getMonthCalendarDates(selectedMonth).map((date, index) => {
              const day = date ? daysByDate.get(date) : undefined;
              return (
                <MonthDayButton
                  key={date ?? `empty-${index}`}
                  date={date}
                  day={day}
                  onToggle={onToggle}
                  onSelectDay={onSelectDay}
                  isSelectedForChange={date === selectedConfirmedDate}
                />
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

function MonthDayButton({
  date,
  day,
  onToggle,
  onSelectDay,
  isSelectedForChange,
}: {
  date: string | null;
  day: AvailabilityDay | undefined;
  onToggle: (date: string) => void;
  onSelectDay: (day: AvailabilityDay | null, date?: string) => void;
  isSelectedForChange: boolean;
}) {
  if (!date) {
    return <div className="min-h-24 rounded-lg bg-muted/20" aria-hidden="true" />;
  }

  if (!day) {
    return (
      <button
        type="button"
        onClick={() => onSelectDay(null, date)}
        className="flex min-h-24 flex-col justify-between rounded-lg border border-border/70 bg-background p-2 text-left text-muted-foreground/55 transition-colors hover:border-border hover:bg-muted/20"
        aria-label={`${formatDate(date, { weekday: "long", day: "numeric", month: "long" })}: unavailable`}
      >
        <span className="font-heading text-xl leading-none">{formatDate(date, { day: "numeric" })}</span>
        <div>
          <p className="font-medium text-xs">Unavailable</p>
          <p className="mt-1 text-[11px]">All day</p>
        </div>
      </button>
    );
  }

  const isConfirmed = day.status === "confirmed";
  const isPending = day.status === "pending";
  const isInteractive = !isPending;
  let className =
    "border-teal-200 bg-teal-50 text-teal-950 hover:border-teal-300 hover:bg-teal-100 dark:border-teal-800 dark:bg-teal-950/30 dark:text-teal-100 dark:hover:bg-teal-950/50";
  let label = "Not selected";

  if (isConfirmed) {
    className = `border-emerald-500 bg-emerald-500 text-white ${isSelectedForChange ? "ring-2 ring-amber-400 ring-offset-2" : ""}`;
    label = "Confirmed";
  } else if (isPending) {
    className = "cursor-not-allowed border-amber-500 bg-amber-500 text-white";
    label = "Change pending";
  } else if (day.selected) {
    className = "border-primary bg-primary/5 text-foreground shadow-sm";
    label = "Available";
  }

  return (
    <button
      type="button"
      disabled={!isInteractive}
      onClick={() => (isConfirmed ? onSelectDay(day) : onToggle(date))}
      className={`flex min-h-24 flex-col justify-between rounded-lg border p-2 text-left transition-colors ${className}`}
      aria-label={`${formatDate(date, { weekday: "long", day: "numeric", month: "long" })}: ${label}`}
      aria-pressed={day.selected}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="font-heading text-xl leading-none">{formatDate(date, { day: "numeric" })}</span>
        {day.selected && !isConfirmed && !isPending && <Check className="size-4 text-primary" />}
        {isConfirmed && <Check className="size-4 text-white" />}
      </div>
      <div>
        <p className={`font-medium text-xs ${isConfirmed || isPending ? "text-white" : ""}`}>{label}</p>
        <p className={`mt-1 text-[11px] ${isConfirmed || isPending ? "text-white/80" : "text-muted-foreground"}`}>
          All day
        </p>
      </div>
    </button>
  );
}

function formatMonth(monthKey: string) {
  const [year, month] = monthKey.split("-").map(Number);
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(year, month - 1, 1, 12));
}

function formatMonthRange(monthKey: string) {
  const { year, month } = getMonthParts(monthKey);
  return new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(year, month - 1, 1, 12));
}

function getDayDetailLabel(day: AvailabilityDay) {
  if (day.status === "confirmed") return "Confirmed";
  if (day.status === "pending") return "Change pending";
  return day.selected ? "Available" : "Not selected";
}

function getDayDetailDescription(day: AvailabilityDay) {
  if (day.status === "confirmed") return "Click this confirmed date to request a cancellation.";
  if (day.status === "pending") return "Your change request is waiting for manager approval.";
  return "Review this date before saving your availability.";
}

function UnavailableCalendar({ days }: { days: AvailabilityDay[] }) {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Availability calendar</CardTitle>
        <CardDescription>
          Your manager has not opened a work window yet. Dates are shown for planning only.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-5">
        <div className="mb-4 flex items-start gap-2 rounded-lg bg-muted/50 p-3 text-muted-foreground text-xs">
          <Info className="mt-0.5 size-4 shrink-0" />
          <span>All dates are disabled until a manager opens an availability window.</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {days.map((day) => (
            <DayCard key={day.date} day={day} onToggle={() => undefined} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LoadingState({ label, compact = false }: { label: string; compact?: boolean }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 text-muted-foreground text-sm ${compact ? "min-h-32" : "min-h-64"}`}
    >
      <LoaderCircle className="size-4 animate-spin" />
      {label}
    </div>
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
  detail: string;
  tone?: "default" | "success" | "info";
}) {
  const toneClass = {
    default: "",
    success: "text-emerald-600 dark:text-emerald-400",
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
      <CardContent>
        <p className="text-muted-foreground text-xs">{detail}</p>
      </CardContent>
    </Card>
  );
}

function DayCard({
  day,
  onToggle,
  onSelectConfirmed,
  isSelectedForChange = false,
}: {
  day: AvailabilityDay;
  onToggle: () => void;
  onSelectConfirmed?: () => void;
  isSelectedForChange?: boolean;
}) {
  const isConfirmed = day.status === "confirmed";
  const isPending = day.status === "pending";
  let cardClassName = "hover:border-primary/50 hover:bg-muted/30";
  let availabilityLabel = "Not selected";

  if (isConfirmed) {
    cardClassName = `cursor-pointer border-emerald-500 bg-emerald-500 text-white ${isSelectedForChange ? "ring-2 ring-amber-400 ring-offset-2" : ""}`;
    availabilityLabel = "Confirmed";
  } else if (isPending) {
    cardClassName = "cursor-not-allowed border-amber-500 bg-amber-500 text-white";
    availabilityLabel = "Change pending";
  } else if (day.selected) {
    cardClassName = "border-primary bg-primary/5 shadow-sm";
    availabilityLabel = "Available";
  }
  let availabilityLabelClass = "text-muted-foreground";
  if (isConfirmed || isPending) availabilityLabelClass = "text-white/90";
  else if (day.selected) availabilityLabelClass = "text-primary";
  return (
    <button
      type="button"
      disabled={isPending}
      onClick={isConfirmed ? onSelectConfirmed : onToggle}
      className={`group relative flex min-h-32 flex-col justify-between rounded-xl border p-3 text-left transition-colors ${cardClassName}`}
      aria-pressed={day.selected}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-sm">{day.weekday}</p>
          <p className="mt-1 font-heading text-3xl leading-none">{day.number}</p>
        </div>
        {isConfirmed || isPending ? null : (
          <span
            aria-hidden="true"
            className={`flex size-4 items-center justify-center rounded-sm border ${
              day.selected ? "border-primary bg-primary text-primary-foreground" : "border-input"
            }`}
          >
            {day.selected && <Check className="size-3" />}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className={availabilityLabelClass}>{availabilityLabel}</span>
        <span className={isConfirmed || isPending ? "text-white/80" : "text-muted-foreground"}>All day</span>
      </div>
    </button>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}
