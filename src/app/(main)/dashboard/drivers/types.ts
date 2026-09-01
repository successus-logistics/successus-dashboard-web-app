import type { paths } from "@/lib/schema";

export const employmentTypes = ["employee", "contractor", "agency"] as const;

export type DriverRecord =
  paths["/api/fleet/drivers/{id}/"]["get"]["responses"]["200"]["content"]["application/json"];

// export type LicenseRecord = paths["/api/fleet/drivers/{id}"]

export type LicenseType = paths["/api/fleet/drivers/"];

export type EmploymentType = (typeof employmentTypes)[number];

export type PartialDriverRecord = Partial<DriverRecord>;
export type DriverCreateType = Omit<DriverRecord, "id">;

// Unused
export interface DriverRecords {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  isActive: boolean;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  utr_number: string;
  vat_number: string;
  licenceNumber: string;
  licenceCategories: string;
  licenceExpiry: string;
  licencePoints: number;
  rightToWorkExpiry: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  notes: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  deletedAt?: string;
  deletedBy?: string;
}

export function driverFactory(overrides?: DriverCreateType): DriverCreateType {
  const defaults = {
    first_name: "",
    last_name: "",
    full_name: "",
    dob: "",
    utr_number: "",
    vat_number: "",
    phone_number: "",
    email: "",
    address: "",
  };

  return {
    ...defaults,
    ...overrides,
  };
}
