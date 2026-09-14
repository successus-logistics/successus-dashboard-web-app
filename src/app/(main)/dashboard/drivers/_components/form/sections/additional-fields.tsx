import { StickyNotes } from "lucide-react";
import FormSection from "../../form";
import FileUpload from "@/components/ui/file_upload";
import { useDriverDraft } from "../driver-draft-context";
import { AttachmentType, DriverRecord } from "../../../types";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import FileDropzone from "@/components/ui/file-dropzone";

export default function AdditionalFields() {
  const { draft, updateField, addFile, removeFile } = useDriverDraft();
  const updateAdditional = <K extends keyof DriverRecord["driver_notes"]>(
    field: K,
    value: DriverRecord["driver_notes"][K],
  ) => updateField("driver_notes", field, value);
  return (
    <FormSection
      title="5. Additional"
      description="Add additional notes you think is needed for this driver."
      icon={StickyNotes}
    >
      <Field className="col-span-full">
        <FieldLabel>Additional Notes</FieldLabel>
        <Textarea
          id="notes"
          value={draft.driver_notes.notes ?? ""}
          placeholder="Follow up needed for right to work information..."
          onChange={(event) => updateAdditional("notes", event.target.value)}
        ></Textarea>
      </Field>

      <FieldGroup className="col-span-full">
        {Object.keys(draft.driver_notes.attachments).length > 0 && (
          <Field>
            <div className="border rounded-2xl border-dashed p-3 grid gap-3">
              <FieldLabel>Additional Files</FieldLabel>
              <div className="flex flex-wrap gap-2">
                {Object.entries(draft.driver_notes.attachments).map(
                  ([key, value]) => {
                    return (
                      <FileDropzone
                        key={key}
                        file={value as AttachmentType}
                        name="additional-files"
                        removeFile={(file) => removeFile("driver_notes", file)}
                      />
                    );
                  },
                )}
              </div>
            </div>
          </Field>
        )}
        <Field className="row-start-2">
          <FieldLabel>Attach Files</FieldLabel>
          <FileUpload
            addFile={(name, file) => addFile("driver_notes", { [name]: file })}
          />
        </Field>
      </FieldGroup>
    </FormSection>
  );
}
