import { apiFetch } from "@/lib/auth/client";

export async function POST(request: Request) {
  const body = await request.json();
  console.log(body);
  const url = `/api/invoices/`;
  try {
    const response = await apiFetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
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
