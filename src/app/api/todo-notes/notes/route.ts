import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

export async function GET() {
  try {
    return NextResponse.json((await apiFetch("/api/todo-notes/notes/")) ?? []);
  } catch (error) {
    return NextResponse.json(
      { message: "Notes could not be loaded." },
      { status: error instanceof HttpError ? error.status : 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    return NextResponse.json(
      await apiFetch("/api/todo-notes/notes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: await request.text(),
      }),
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Note could not be saved." },
      { status: error instanceof HttpError ? error.status : 503 },
    );
  }
}
