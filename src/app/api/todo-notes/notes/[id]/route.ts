import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

type Context = { params: Promise<{ id: string }> };
export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return NextResponse.json(
      await apiFetch(`/api/todo-notes/notes/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: await request.text(),
      }),
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Note could not be updated." },
      { status: error instanceof HttpError ? error.status : 503 },
    );
  }
}
export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    await apiFetch(`/api/todo-notes/notes/${id}/`, { method: "DELETE" });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { message: "Note could not be deleted." },
      { status: error instanceof HttpError ? error.status : 503 },
    );
  }
}
