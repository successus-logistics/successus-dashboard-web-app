import {
  DriverAdjustment,
  IndividualTimesheets,
} from "../_components/driver-timesheet-table";
import DriverTimesheets from "../_components/driver-timesheets";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, ExternalLink, File } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/auth/client";

type TimesheetBatchResponseType = {
  timesheets: IndividualTimesheets;
  file_url: string;
};

async function getIndividualTimesheets(
  slug: string,
): Promise<TimesheetBatchResponseType> {
  const response = await apiFetch<TimesheetBatchResponseType>(
    "/api/timesheets/" + slug,
  );
  return response;
}

async function getAdjustments(slug: string): Promise<DriverAdjustment> {
  const response = await apiFetch<{ data: DriverAdjustment }>(
    "/api/timesheets/" + slug + "/adjustments/",
  );
  return response.data;
}

export default async function TimesheetSubmissionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const timesheets = await getIndividualTimesheets(slug);
  const adjustments = await getAdjustments(slug);
  return (
    <div>
      <div className="flex justify-between">
        <Button asChild variant={"link"}>
          <Link href={"/dashboard/timesheets"}>
            <ArrowLeft />
            Back
          </Link>
        </Button>
        <div className="flex gap-3 ">
          <Button asChild variant={"default"} size={"sm"}>
            <Link
              href={timesheets.file_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <File />
              Original File
            </Link>
          </Button>
          <Button asChild variant={"outline"} size={"sm"}>
            <Link href={"/dashboard/invoices"}>
              Invoices
              <ExternalLink />
            </Link>
          </Button>
        </div>
      </div>
      <DriverTimesheets
        week={slug}
        timesheets={timesheets.timesheets}
        adjustments={adjustments}
      />
    </div>
  );
}
