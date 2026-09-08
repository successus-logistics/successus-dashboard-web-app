import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

interface RouteContext {
  params: Promise<{ windowId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { windowId } = await context.params;
    const dashboard = await apiFetch(`/api/availability/windows/${windowId}/dashboard/`);
    return NextResponse.json(dashboard);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to load availability dashboard." }, { status: 502 });
  }
}
