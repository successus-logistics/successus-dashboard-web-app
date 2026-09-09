import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const assignments = await apiFetch("/api/availability/assignments/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return NextResponse.json(assignments, { status: 201 });
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to confirm driver availability." }, { status: 502 });
  }
}
