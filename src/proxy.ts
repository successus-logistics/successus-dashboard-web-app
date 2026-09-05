import { type NextRequest, NextResponse } from "next/server";

import {
  canAccessRoute,
  roleHomeRoutes,
} from "@/lib/access-control/role-access.data";
import { decodeJwtPayload } from "./lib/auth/api-auth-provider";
import { resolveAppRole } from "./lib/auth/resolve-app-role";

const loginRoute = "/auth/v1/login";
const unauthorizedRoute = "/unauthorized";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access_token = request.cookies.get("access_token");
  const refresh_token = request.cookies.get("refresh_token");
  
  if (access_token){
    const jwt = decodeJwtPayload(access_token.value)
    if (jwt.exp * 1000 < Date.now()){
      const loginUrl = new URL(loginRoute, request.url);
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access_token")
      response.cookies.delete("refresh_token")
      console.log("deco")
      return response
    }
  }


  if (!access_token && !refresh_token && !pathname.includes("/auth")) {
    const loginUrl = new URL(loginRoute, request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }
  const response = NextResponse.next();
  if (refresh_token) {
    const jwt = decodeJwtPayload(refresh_token.value)
    if (jwt.exp * 1000 < Date.now()) {
      const loginUrl = new URL(loginRoute, request.url);
      loginUrl.searchParams.set("next", pathname);
      const response = NextResponse.redirect(loginUrl);
      response.cookies.delete("access_token")
      response.cookies.delete("refresh_token")
      console.log("deco")
      return response
    }

  }
  if (!access_token && !refresh_token) {
    return;
  }

  if (!access_token && refresh_token) {
    const refreshUrl = await fetch(
      process.env.API_URL + "/api/token/refresh/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: refresh_token.value }),
      },
    );
    if (refreshUrl.ok) {
      const access_token = await refreshUrl.json();
      response.cookies.set("access_token", access_token.access);
      return response;
    }
  }

  const role = resolveAppRole(
    decodeJwtPayload(request.cookies.get("access_token").value).roles,
  );

  if (!role) {
    const loginUrl = new URL(loginRoute, request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/dashboard") {
    return NextResponse.redirect(new URL(roleHomeRoutes[role], request.url));
  }

  if (!canAccessRoute(role, pathname)) {
    return NextResponse.redirect(new URL(unauthorizedRoute, request.url));
  }

  const url = new URL(roleHomeRoutes[role], request.url);
  if (pathname.includes("auth")) {
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
