"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useState,
} from "react";

import { AttachmentType, driverFactory, type DriverRecord } from "../../types";

type DraftSection = keyof DriverRecord;

interface DriverDraftContextValue {
  draft: DriverRecord;
  updateField: <
    Section extends DraftSection,
    Field extends keyof NonNullable<DriverRecord[Section]>,
  >(
    section: Section,
    field: Field,
    value: NonNullable<DriverRecord[Section]>[Field],
  ) => void;
  clearSection: <Section extends DraftSection>(section: Section) => void;
  removeFile: <Section extends DraftSection>(
    section: Section,
    file: AttachmentType,
  ) => void;
  addFile: (
    section: keyof DriverRecord,
    newAttachment: Record<string, AttachmentType>,
    required?: boolean,
  ) => void;
}

const DriverDraftContext = createContext<DriverDraftContextValue | null>(null);

export function DriverDraftProvider({ children }: PropsWithChildren) {
  const [draft, setDraft] = useState<DriverRecord>(driverFactory());

  const updateField: DriverDraftContextValue["updateField"] = (
    section,
    field,
    value,
  ) => {
    setDraft((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));
  };

  const clearSection = (section: keyof DriverRecord) => {
    setDraft((current) => ({
      ...current,
      [section]: driverFactory()[section],
    }));
  };

  const removeMatchingFile = (
    files: Record<string, AttachmentType>,
    targetFile: AttachmentType,
  ) => {
    console.log("matching", files);
    return Object.fromEntries(
      Object.entries(files).filter(
        ([_, file]) => file.file_name !== targetFile.file_name,
      ),
    );
  };

  const removeFile = (
    section: keyof DriverRecord,
    targetFile: AttachmentType,
  ) => {
    setDraft((current) => {
      const currentAttachments = current[section].attachments;

      const attachments = removeMatchingFile(currentAttachments, targetFile);
      console.log("top layer", attachments);

      if (currentAttachments.additional) {
        attachments.additional = removeMatchingFile(
          currentAttachments.additional,
          targetFile,
        );
        console.log("bottom layer", attachments);
      }

      return {
        ...current,
        [section]: {
          ...current[section],
          attachments,
        },
      };
    });
  };

  const addFile = (
    section: keyof DriverRecord,
    newAttachment: Record<string, AttachmentType>,
    required: boolean = true,
  ) => {
    setDraft((current) => {
      const attachments = current[section].attachments;
      return {
        ...current,
        ...{
          [section]: {
            ...current[section],
            attachments: required
              ? {
                  ...attachments,
                  ...newAttachment,
                }
              : {
                  ...attachments,
                  additional: {
                    ...attachments.additional,
                    ...newAttachment,
                  },
                },
          },
        },
      };
    });
  };

  return (
    <DriverDraftContext.Provider
      value={{ draft, updateField, clearSection, removeFile, addFile }}
    >
      {children}
    </DriverDraftContext.Provider>
  );
}

export function useDriverDraft() {
  const context = useContext(DriverDraftContext);

  if (!context) {
    throw new Error(
      "useDriverDraft must be used within a DriverDraftProvider.",
    );
  }

  return context;
}
