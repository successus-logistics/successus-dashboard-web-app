import { apiFetch } from "@/lib/auth/client";

export async function POST(request: Request) {
  const formData = await request.formData();
  console.log(formData.get("type"));
  const url = `/api/timesheets/${formData.get("timesheet_id")}/adjustments/`;
  console.log(url);
  try {
    const response = await apiFetch(url, {
      method: "POST",
      body: formData,
    });

    return Response.json(
      {
        message: "Successfully created deduction",
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("error", error);
    return Response.json(
      {
        message: "Failed to create Deduction. Please try again later.",
      },
      { status: 400 },
    );
  }
}
