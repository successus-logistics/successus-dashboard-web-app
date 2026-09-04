import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function EmailForm() {
  return (
    <div className="py-2">
      <DialogHeader className="border-b px-5 pt-5 pb-4">
        <DialogTitle>Send email invitation</DialogTitle>
        <DialogDescription>
          Send an email invitation to a driver so they can complete their
          details.
        </DialogDescription>
      </DialogHeader>
      <form className="flex min-h-0 flex-col py-2">
        <div className="grid max-h-[calc(92vh-9.5rem)] gap-4 overflow-y-auto bg-muted/20 p-4">
          <Field>
            <FieldLabel required htmlFor="email">
              Email
            </FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="driver@email.com"
              required
            />
          </Field>
        </div>
        <DialogFooter className="m-0 shrink-0 px-5">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit">Send</Button>
        </DialogFooter>
      </form>
    </div>
  );
}
