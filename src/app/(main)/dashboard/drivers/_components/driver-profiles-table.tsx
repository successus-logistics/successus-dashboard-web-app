"use client";

import * as React from "react";

import {
  ChevronLeft,
  ChevronRight,
  Download,
  Ellipsis,
  FileDown,
  FileSpreadsheet,
  Pencil,
  Plus,
  Search,
  Trash2,
  Undo2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  driverFactory,
  type DriverRecord,
  PartialDriverRecord,
} from "../types";
import { DriverProfileDialog } from "./driver-profile-dialog";
import Link from "next/link";

const driverViews = ["active", "deleted"] as const;

type DriverView = (typeof driverViews)[number];

const driverStatusStyles = (isActive: boolean) =>
  isActive
    ? "border-emerald-200 bg-emerald-50 text-emerald-700 " +
      "dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
    : "border-slate-200 bg-slate-50 text-slate-700 " +
      "dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300";

function formatLabel(value: string) {
  return value
    .split("_")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function formatDate(value: string) {
  if (!value) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00Z`));
}

function matchesSearch(driver: PartialDriverRecord, normalizedQuery: string) {
  if (!normalizedQuery) {
    return true;
  }

  return [
    driver?.id,
    driver?.first_name,
    driver?.last_name,
    driver?.email,
    driver?.phone_number,
    driver.full_name,
  ].some((value) => value?.toLowerCase().includes(normalizedQuery));
}

export function DriverProfilesTable({
  initialDrivers,
}: {
  initialDrivers: DriverRecord[];
}) {
  const [drivers, setDrivers] = React.useState(initialDrivers);
  const [view, setView] = React.useState<DriverView>("active");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(
    () => new Set(),
  );
  const [editingDriver, setEditingDriver] = React.useState(driverFactory());
  const [dialogMode, setDialogMode] = React.useState<"add" | "edit">("edit");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = React.useState(0);
  const [isSaving, setIsSaving] = React.useState(false);
  const importInputRef = React.useRef<HTMLInputElement>(null);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const driversInView = drivers.filter((driver) => driver);
  const filteredDrivers = driversInView.filter((driver) =>
    matchesSearch(driver, normalizedQuery),
  );
  const pageCount = Math.max(1, Math.ceil(filteredDrivers.length / pageSize));
  const currentPageIndex = Math.min(pageIndex, pageCount - 1);
  const pageStart = currentPageIndex * pageSize;
  const paginatedDrivers = filteredDrivers.slice(
    pageStart,
    pageStart + pageSize,
  );
  const pageIds = paginatedDrivers.map((driver) => driver.id);
  const selectedOnPageCount = pageIds.filter((id) =>
    selectedIds.has(id ?? ""),
  ).length;
  const isPageSelected =
    pageIds.length > 0 && selectedOnPageCount === pageIds.length;
  const isPagePartiallySelected = selectedOnPageCount > 0 && !isPageSelected;

  function openAddDialog() {
    setDialogMode("add");
    setEditingDriver(driverFactory());
    setIsProfileDialogOpen(true);
  }

  function openEditDialog(driver: DriverRecord) {
    setDialogMode("edit");
    setEditingDriver(driver);
    setIsProfileDialogOpen(true);
  }

  async function saveDriver(driver: PartialDriverRecord) {
    setIsSaving(true);

    try {
      // TODO: POST NEW DRIVER
      toast.success(
        `${driver.full_name} was ${dialogMode === "add" ? "added" : "updated"} and saved locally.`,
      );
      return true;
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save the driver data file.",
      );
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function togglePageSelection(checked: boolean | "indeterminate") {
    setSelectedIds((current) => {
      const next = new Set(current);

      for (const id of pageIds) {
        if (checked === true) {
          next.add(id);
        } else {
          next.delete(id);
        }
      }

      return next;
    });
  }

  function toggleDriver(driverId: string, checked: boolean | "indeterminate") {
    setSelectedIds((current) => {
      const next = new Set(current);

      if (checked === true) {
        next.add(driverId);
      } else {
        next.delete(driverId);
      }

      return next;
    });
  }

  async function deleteSelectedDrivers() {
    const deletedCount = selectedIds.size;

    setIsSaving(true);

    try {
      toast.success(
        view === "deleted"
          ? `${deletedCount} driver${deletedCount === 1 ? "" : "s"} permanently deleted.`
          : `${deletedCount} driver${deletedCount === 1 ? "" : "s"} moved to Deleted.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to save the driver data file.",
      );
      return;
    } finally {
      setIsSaving(false);
    }

    setSelectedIds(new Set());
    setPageIndex(0);
  }

  async function restoreDrivers(driverIds: Set<string>) {
    const restoredCount = driverIds.size;

    setIsSaving(true);

    setSelectedIds(new Set());
    setPageIndex(0);
    toast.success(
      `${restoredCount} driver${restoredCount === 1 ? "" : "s"} restored.`,
    );
  }

  function updatePageSize(value: string) {
    const nextPageSize = Number(value);

    if (
      Number.isInteger(nextPageSize) &&
      nextPageSize >= 1 &&
      nextPageSize <= 100
    ) {
      setPageSize(nextPageSize);
      setPageIndex(0);
    }
  }

  function showExportPlaceholder(exportType: "template" | "data") {
    if (exportType === "data" && selectedIds.size === 0) {
      toast.info("Select one or more drivers before exporting data.");
      return;
    }

    toast.info(
      exportType === "template"
        ? "Driver import template export will be connected later."
        : `Export for ${selectedIds.size} selected driver${selectedIds.size === 1 ? "" : "s"} will be connected later.`,
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl leading-none tracking-tight">
            Driver Profiles
          </h1>
          <p className="text-muted-foreground text-sm">
            Maintain driver identity, employment, licence, vehicle and
            compliance records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <input
            ref={importInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];

              if (file) {
                toast.info(
                  `${file.name} is ready for import. Database import will be connected later.`,
                );
                event.target.value = "";
              }
            }}
          />
          {view === "active" && (
            <Button
              type="button"
              variant="outline"
              onClick={() => importInputRef.current?.click()}
            >
              <Upload data-icon="inline-start" />
              Import
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button type="button" variant="outline">
                <Download data-icon="inline-start" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onSelect={() => showExportPlaceholder("template")}
              >
                <FileSpreadsheet />
                Export template
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => showExportPlaceholder("data")}>
                <FileDown />
                Export selected data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {view === "active" ? (
            <Button type="button" disabled={isSaving} onClick={openAddDialog}>
              <Plus data-icon="inline-start" />
              Add
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              disabled={selectedIds.size === 0 || isSaving}
              onClick={() => restoreDrivers(selectedIds)}
            >
              <Undo2 data-icon="inline-start" />
              Restore{selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
            </Button>
          )}
          <Button
            type="button"
            variant="destructive"
            disabled={selectedIds.size === 0 || isSaving}
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 data-icon="inline-start" />
            {view === "deleted" ? "Delete permanently" : "Delete"}
            {selectedIds.size > 0 ? ` (${selectedIds.size})` : ""}
          </Button>
        </div>
      </div>

      <section
        className="flex flex-col gap-3"
        aria-labelledby="driver-list-heading"
      >
        <h2 id="driver-list-heading" className="sr-only">
          Driver list
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={view}
            onValueChange={(value) => {
              if (driverViews.includes(value as DriverView)) {
                setView(value as DriverView);
                setSelectedIds(new Set());
                setPageIndex(0);
              }
            }}
          >
            <TabsList>
              <TabsTrigger value="active">Active drivers</TabsTrigger>
              <TabsTrigger value="deleted">Deleted</TabsTrigger>
            </TabsList>
          </Tabs>

          <InputGroup className="w-full sm:max-w-md">
            <InputGroupInput
              value={searchQuery}
              placeholder={
                view === "deleted"
                  ? "Search deleted drivers..."
                  : "Search drivers, IDs, vehicles or depots..."
              }
              aria-label={
                view === "deleted"
                  ? "Search deleted driver profiles"
                  : "Search driver profiles"
              }
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setPageIndex(0);
              }}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-4 px-0">
            <Table className="table-fixed *:w-full">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      aria-label="Select all drivers on this page"
                      checked={
                        isPageSelected
                          ? true
                          : isPagePartiallySelected
                            ? "indeterminate"
                            : false
                      }
                      onCheckedChange={togglePageSelection}
                    />
                  </TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Licence expiry</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDrivers.length > 0 ? (
                  paginatedDrivers.map((driver) => (
                    <TableRow
                      key={driver.id}
                      data-state={
                        selectedIds.has(driver.id) ? "selected" : undefined
                      }
                    >
                      <TableCell>
                        <Checkbox
                          aria-label={`Select ${driver.full_name}`}
                          checked={selectedIds.has(driver.id)}
                          onCheckedChange={(checked) =>
                            toggleDriver(driver.id, checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        {view === "active" ? (
                          <Button
                            type="button"
                            variant="link"
                            className="h-auto px-0"
                            asChild
                          >
                            <Link href={`drivers/${driver.id}`}>
                              {driver.full_name}
                            </Link>
                          </Button>
                        ) : (
                          <p className="font-medium">{driver.full_name}</p>
                        )}
                      </TableCell>
                      <TableCell>
                        <p>{driver.phone_number}</p>
                        <p className="text-muted-foreground text-xs">
                          {driver.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={driverStatusStyles(true)}
                        >
                          {formatLabel(true ? "active" : "deleted")}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate("")}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-sm"
                              aria-label={`Actions for ${driver.full_name}`}
                            >
                              <Ellipsis />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {view === "active" ? (
                              <DropdownMenuItem
                                onSelect={() => openEditDialog(driver)}
                              >
                                <Pencil />
                                View and edit profile
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onSelect={() => {
                                  restoreDrivers(new Set([driver.id]));
                                }}
                              >
                                <Undo2 />
                                Restore driver
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              variant="destructive"
                              onSelect={() => {
                                setSelectedIds(new Set([driver.id]));
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 />
                              {view === "deleted"
                                ? "Delete permanently"
                                : "Delete driver"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={10}
                      className="h-28 text-center text-muted-foreground"
                    >
                      {view === "deleted"
                        ? "No deleted drivers."
                        : "No drivers found."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>

            <div className="flex flex-col gap-3 px-4 pb-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-muted-foreground text-sm">
                Viewing {paginatedDrivers.length} out of{" "}
                {filteredDrivers.length} {view === "deleted" ? "deleted " : ""}
                drivers
                {selectedIds.size > 0 ? ` · ${selectedIds.size} selected` : ""}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                <label
                  className="text-muted-foreground text-sm"
                  htmlFor="drivers-page-size"
                >
                  Rows per page
                </label>
                <Input
                  id="drivers-page-size"
                  className="h-8 w-16 text-center"
                  type="number"
                  min="1"
                  max="100"
                  value={pageSize}
                  onChange={(event) => updatePageSize(event.target.value)}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPageIndex === 0}
                  onClick={() => setPageIndex((current) => current - 1)}
                >
                  <ChevronLeft />
                  Previous
                </Button>
                <span className="flex size-8 items-center justify-center rounded-md bg-muted text-sm">
                  {currentPageIndex + 1}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={currentPageIndex >= pageCount - 1}
                  onClick={() => setPageIndex((current) => current + 1)}
                >
                  Next
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <DriverProfileDialog
        driver={editingDriver}
        open={isProfileDialogOpen}
        onOpenChange={setIsProfileDialogOpen}
        onSave={saveDriver}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {view === "deleted"
                ? "Permanently delete selected drivers?"
                : "Move selected drivers to Deleted?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {view === "deleted"
                ? `This will permanently remove ${selectedIds.size} driver${selectedIds.size === 1 ? "" : "s"}. This action cannot be undone in the current view.`
                : `This will move ${selectedIds.size} driver${selectedIds.size === 1 ? "" : "s"} to the Deleted list. You can restore them later.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={isSaving}
              onClick={deleteSelectedDrivers}
            >
              {view === "deleted" ? "Delete permanently" : "Move to Deleted"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
