import { NextResponse } from "next/server";

import { apiFetch, HttpError } from "@/lib/auth/client";

type Context = { params: Promise<{ id: string; commentId: string }> };
function statusOf(error: unknown) {
  return error instanceof HttpError ? error.status : 503;
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const { id, commentId } = await context.params;
    await apiFetch(`/api/todo-notes/tasks/${id}/comments/${commentId}/`, { method: "DELETE" });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ message: "Comment could not be deleted." }, { status: statusOf(error) });
  }
}
