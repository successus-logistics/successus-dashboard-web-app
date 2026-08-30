import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

const contracts = [
  {
    driver_id: 1,
    name: "Van Inspections",
    description: "Driver must adhere to the maintanence policies",
    status: "agreed",
    signed_date: "2026-08-26",
    contract_active: "active",
  },
  {
    driver_id: 1,
    name: "Delivery Conduct",
    description: "Driver must adhere to the maintanence policies",
    status: "agreed",
    signed_date: "2026-08-26",
    contract_active: "active",
  },
  {
    driver_id: 1,
    name: "Disp",
    description: "Driver must adhere to the maintanence policies",
    status: "agreed",
    signed_date: "2026-08-26",
    contract_active: "active",
  },
  {
    driver_id: 1,
    name: "Health and Safety",
    description: "Driver must adhere to the maintanence policies",
    status: "agreed",
    signed_date: "2026-08-26",
    contract_active: "active",
  },
];

export default function DriverContracts() {
  return (
    <div className="grid gap-2">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Contracts</CardTitle>
        <div>
          <Badge>1/10</Badge>
        </div>
      </CardHeader>
      <CardContent className="gap-2 flex flex-col">
        {contracts.map((contract) => (
          <div
            key={contract.name}
            className="flex border rounded-lg items-center p-2"
          >
            <CardHeader className="w-1/2 flex items-center gap-3">
              <Checkbox className="inline" />
              <div>
                <CardTitle>{contract.name}</CardTitle>
                <CardDescription
                  title={contract.description}
                  className="line-clamp-1"
                >
                  {contract.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="w-full grid grid-cols-4 items-center">
              <div>
                <Badge>{contract.status}</Badge>
              </div>
              <div>{contract.signed_date}</div>
              <Button variant={"link"} className="p-0 block text-start">
                attachment
              </Button>
              <div>{contract.contract_active}</div>
            </CardContent>
          </div>
        ))}
      </CardContent>
    </div>
  );
}
