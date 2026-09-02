import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

function errorResponse(error: unknown) {
  if (error instanceof HttpError)
    return NextResponse.json({ message: "The To-Do API request failed." }, { status: error.status });
  return NextResponse.json({ message: "The To-Do API is unavailable." }, { status: 503 });
}

export async function GET() {
  try {
    return NextResponse.json((await apiFetch("/api/todo-notes/tasks/")) ?? []);
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    return NextResponse.json(
      await apiFetch("/api/todo-notes/tasks/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: await request.text(),
      }),
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}
