import { NextResponse } from "next/server";
import { apiFetch, HttpError } from "@/lib/auth/client";

function errorResponse(error: unknown) {
  if (error instanceof HttpError)
    return NextResponse.json({ message: "The To-Do API request failed." }, { status: error.status });
  return NextResponse.json({ message: "The To-Do API is unavailable." }, { status: 503 });
}
type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return NextResponse.json(await apiFetch(`/api/todo-notes/tasks/${id}/`));
  } catch (error) {
    return errorResponse(error);
  }
}
export async function PATCH(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return NextResponse.json(
      await apiFetch(`/api/todo-notes/tasks/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: await request.text(),
      }),
    );
  } catch (error) {
    return errorResponse(error);
  }
}
export async function DELETE(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    await apiFetch(`/api/todo-notes/tasks/${id}/`, { method: "DELETE" });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return errorResponse(error);
  }
}
