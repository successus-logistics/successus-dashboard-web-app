import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

export async function GET() {
  try {
    const windows = await apiFetch("/api/availability/windows/");
    return NextResponse.json(windows ?? []);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to load availability windows." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const window = await apiFetch("/api/availability/windows/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(window, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to create availability window." }, { status: 502 });
  }
}
