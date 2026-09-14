import { FieldSet } from "@/components/ui/field";
import { ComponentPropsWithRef } from "react";

interface FormSectionProps {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}

export default function FormSection({
  title,
  description,
  icon: Icon,
  children,
  ...props
}: FormSectionProps & ComponentPropsWithRef<typeof FieldSet>) {
  return (
    <FieldSet {...props}>
      <div className="flex items-start gap-3 border-b p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-muted-foreground text-xs">{description}</p>
        </div>
      </div>
      <div className="grid gap-4 p-4 sm:grid-cols-2">{children}</div>
    </FieldSet>
  );
}
