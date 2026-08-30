import { apiFetch } from "@/lib/auth/client";
import { DriverProfilesTable } from "./_components/driver-profiles-table";
import { DriverRecord } from "./types";

async function getDrivers() {
  const response = await apiFetch<Promise<DriverRecord[]>>(
    "/api/fleet/drivers/",
  );
  if (response) return response;
  return;
}

export default async function DriverProfilesPage() {
  const drivers = await getDrivers();
  return <DriverProfilesTable initialDrivers={drivers} />;
}
