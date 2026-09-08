import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

export async function GET(request: Request) {
  try {
    const query = new URL(request.url).search;
    const requests = await apiFetch(`/api/availability/change-requests/mine/${query}`);
    return NextResponse.json(requests ?? []);
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(error.data ?? { detail: error.message }, { status: error.status });
    }
    return NextResponse.json({ detail: "Unable to load your availability requests." }, { status: 502 });
  }
}
