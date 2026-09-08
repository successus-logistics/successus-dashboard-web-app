import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

interface RouteContext {
  params: Promise<{ assignmentId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { assignmentId } = await context.params;
    const body = await request.json();
    const changeRequest = await apiFetch(`/api/availability/assignments/${assignmentId}/change-requests/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(changeRequest, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to submit the availability change request." }, { status: 502 });
  }
}
