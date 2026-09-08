import { apiFetch } from "@/lib/auth/client";

import { DriverProfilesTable } from "./_components/driver-profiles-table";
import { type DriverRecord, driverFactory } from "./types";

interface ApiDriver {
  id: string;
  first_name: string | null;
  last_name: string | null;
  full_name: string;
  phone_number: string;
  email: string | null;
  dob: string | null;
  address: string | null;
  utr: string | null;
  vat: string | null;
  emergency_contact_name: string | null;
  emergency_contact_relationship: string | null;
  emergency_contact_phone_number: string;
  active: boolean;
  created_at: string;
}

async function getDrivers(): Promise<DriverRecord[]> {
  const response = await apiFetch<ApiDriver[]>("/api/fleet/drivers/");
  return (response ?? []).map((driver) => ({
    ...driverFactory(),
    id: driver.id,
    firstName: driver.first_name ?? "",
    lastName: driver.last_name ?? "",
    fullName: driver.full_name,
    isActive: driver.active,
    dateOfBirth: driver.dob ?? "",
    phone: driver.phone_number ?? "",
    email: driver.email ?? "",
    address: driver.address ?? "",
    utr_number: driver.utr ?? "",
    vat_number: driver.vat ?? "",
    emergencyContactName: driver.emergency_contact_name ?? "",
    emergencyContactRelationship: driver.emergency_contact_relationship ?? "",
    emergencyContactPhone: driver.emergency_contact_phone_number ?? "",
    createdAt: driver.created_at,
  }));
}

export default async function DriverProfilesPage() {
  const drivers = await getDrivers();
  return <DriverProfilesTable initialDrivers={drivers} />;
}
