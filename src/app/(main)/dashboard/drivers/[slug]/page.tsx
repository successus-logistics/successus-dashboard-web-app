import { apiFetch } from "@/lib/auth/client";
import { DriverRecord } from "../types";
import NotFound from "@/app/not-found";
import DriverProfile from "./_components/driver-profile";

async function getDriverDetails(slug: string) {
  try {
    const driverDetials = await apiFetch<DriverRecord>(
      `/api/fleet/drivers/${slug}`,
    );
    return driverDetials;
  } catch (e) {
    return false;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const driverDetails = await getDriverDetails(slug);
  if (driverDetails) {
    return (
      <DriverProfile driverDetails={driverDetails} />
    );
  }
  return <NotFound />;
}


