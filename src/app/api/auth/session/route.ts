import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { MOCK_USER_ID_COOKIE_NAME } from "@/lib/access-control/role-access.data";

export async function GET() {
  return cookies().then((cookieStore) =>
    NextResponse.json({ userId: cookieStore.get(MOCK_USER_ID_COOKIE_NAME)?.value ?? null }),
  );
}
