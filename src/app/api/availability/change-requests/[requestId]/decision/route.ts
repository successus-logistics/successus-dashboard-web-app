import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

interface RouteContext {
  params: Promise<{ requestId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { requestId } = await context.params;
    const body = await request.json();
    const result = await apiFetch(`/api/availability/change-requests/${requestId}/decision/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to review availability request." }, { status: 502 });
  }
}
