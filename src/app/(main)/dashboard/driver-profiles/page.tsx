import { apiFetch } from "@/lib/auth/client";
import { DriverProfilesTable } from "./_components/driver-profiles-table";
import { DriverRecord } from "./types";
import type { paths } from "@/lib/schema";

async function getDrivers() {
  const response =
    await apiFetch<Promise<paths["/api/drivers/"]>>("/api/drivers/");
  if (response) return response;
  return;
}

export default async function DriverProfilesPage() {
  const drivers = await getDrivers();
  console.log(drivers);
  return <DriverProfilesTable initialDrivers={drivers} />;
}
