import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ windowId: string; date: string; action: string }> },
) {
  const { windowId, date, action } = await params;
  if (action !== "open" && action !== "close") {
    return NextResponse.json({ detail: "Unsupported availability day action." }, { status: 400 });
  }

  try {
    const day = await apiFetch(`/api/availability/windows/${windowId}/days/${date}/${action}/`, { method: "POST" });
    return NextResponse.json(day);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to update availability day." }, { status: 502 });
  }
}
