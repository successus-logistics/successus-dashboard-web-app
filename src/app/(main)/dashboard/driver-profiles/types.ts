export const employmentTypes = ["employee", "contractor", "agency"] as const;

export type EmploymentType = (typeof employmentTypes)[number];

export type PartialDriverRecord = Partial<DriverRecord>;
export type DriverCreateType = Omit<DriverRecord, "id">;

export interface DriverRecord {
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
  const timestamp = new Date().toISOString();

  const defaults = {
    firstName: "",
    lastName: "",
    fullName: "",
    dateOfBirth: "",
    utr_number: "",
    vat_number: "",
    phone: "",
    email: "",
    address: "",
    licenceNumber: "",
    licenceCategories: "",
    licenceExpiry: "",
    licencePoints: 0,
    rightToWorkExpiry: "",
    emergencyContactName: "",
    emergencyContactRelationship: "",
    emergencyContactPhone: "",
    notes: "",
    createdAt: timestamp,
    createdBy: "current user",
    updatedAt: timestamp,
    updatedBy: "current user",
    isActive: true,
  };

  return {
    ...defaults,
    ...overrides,
  };
}
