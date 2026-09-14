import type { components, paths } from "@/lib/schema";

export const employmentTypes = ["employee", "contractor", "agency"] as const;

export type AttachmentType =
  | {
      file_name: string;
      file_type: string;
      start_date: string | undefined;
      expiry_date: string | undefined;
      file: File | undefined;
      file_size: number;
    }
  | Record<string, never>;

export type DriverOnboardingRecord = components["schemas"]["DriverOnboarding"];
export interface DriverRecord extends DriverOnboardingRecord {
  driver: DriverOnboardingRecord["driver"] & {
    attachments: {
      proof_of_address?: AttachmentType;
      additional?: Record<string, AttachmentType>;
    };
  };
  licence_submission: Partial<DriverOnboardingRecord["licence_submission"]> & {
    attachments: {
      licence_front_image: AttachmentType;
      licence_back_image: AttachmentType;
      additional?: Record<string, AttachmentType>;
    };
  };
  // Update this type later to extend not overwrite!!
  legal: {
    document_type?: string;
    valid_from?: string;
    expiry_date?: string;
    passport_number?: string;
    share_code?: string;
    attachments: {
      passport?: AttachmentType;
      additional?: Record<string, AttachmentType>;
    };
    notes?: string;
  };
  driver_notes: {
    notes?: string;

    attachments: Record<string, AttachmentType>;
  };
}

// export type LicenseRecord = paths["/api/fleet/drivers/{id}"]
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
  const defaults: DriverCreateType = {
    driver: {
      first_name: "",
      last_name: "",
      full_name: "",
      dob: "",
      utr: "",
      vat: "",
      phone_number: "",
      email: "",
      address: "",
      attachments: {},
    },
    licence_submission: {
      attachments: {
        licence_front_image: {},
        licence_back_image: {},
      },
    },
    legal: {
      attachments: {},
    },
    driver_notes: {
      notes: "",
      attachments: {},
    },
  };

  return {
    ...defaults,
    ...overrides,
  };
}
