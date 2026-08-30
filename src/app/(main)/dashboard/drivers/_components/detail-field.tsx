import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export function DetialField({
  field,
  value,
}: {
  field: React.ReactNode;
  value: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-[1fr_2fr] items-center">
        <h2 className="font-semibold">{field}</h2>
        <Input type="text" defaultValue={value} />
      </div>
    </div>
  );
}
