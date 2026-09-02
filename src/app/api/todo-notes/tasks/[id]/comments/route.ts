import { NextResponse } from "next/server";
import { apiFetch, HttpError } from "@/lib/auth/client";

type Context = { params: Promise<{ id: string }> };
function statusOf(error: unknown) {
  return error instanceof HttpError ? error.status : 503;
}

export async function GET(_request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return NextResponse.json((await apiFetch(`/api/todo-notes/tasks/${id}/comments/`)) ?? []);
  } catch (error) {
    return NextResponse.json({ message: "Comments could not be loaded." }, { status: statusOf(error) });
  }
}
export async function POST(request: Request, { params }: Context) {
  try {
    const { id } = await params;
    return NextResponse.json(
      await apiFetch(`/api/todo-notes/tasks/${id}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: await request.text(),
      }),
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json({ message: "Comment could not be saved." }, { status: statusOf(error) });
  }
}
