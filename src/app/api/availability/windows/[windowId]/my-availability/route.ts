import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

interface RouteContext {
  params: Promise<{ windowId: string }>;
}

async function forwardError(error: unknown) {
  if (error instanceof HttpError) {
    return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
  }
  return NextResponse.json({ detail: "Unable to load availability." }, { status: 502 });
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { windowId } = await context.params;
    const availability = await apiFetch(`/api/availability/windows/${windowId}/my-availability/`);
    return NextResponse.json(availability);
  } catch (error) {
    return forwardError(error);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { windowId } = await context.params;
    const body = await request.json();
    const availability = await apiFetch(`/api/availability/windows/${windowId}/my-availability/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(availability);
  } catch (error) {
    return forwardError(error);
  }
}
