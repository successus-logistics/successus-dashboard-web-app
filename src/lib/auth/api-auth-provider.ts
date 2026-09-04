import { z } from "zod";

import type { AuthCredentials, AuthSession } from "./auth.types";
import { resolveAppRole } from "./resolve-app-role";

const tokenEndpoint = `${process.env.API_URL}/api/token/`;

const tokenResponseSchema = z.object({
  access: z.string().min(1),
  refresh: z.string().min(1),
});

const jwtPayloadSchema = z.object({
  exp: z.number(),
  user_id: z.union([z.string(), z.number()]),
  roles: z.array(z.string()),
  username: z.string(),
});

export class AuthApiUnavailableError extends Error {
  constructor() {
    super("The authentication API is currently unavailable.");
    this.name = "AuthApiUnavailableError";
  }
}

export class InvalidAuthApiResponseError extends Error {
  constructor() {
    super("The authentication API returned an invalid response.");
    this.name = "InvalidAuthApiResponseError";
  }
}

export function decodeJwtPayload(token: string): unknown {
  const segments = token.split(".");

  if (segments.length !== 3 || !segments[1]) {
    throw new InvalidAuthApiResponseError();
  }

  try {
    const payload = Buffer.from(segments[1], "base64url").toString("utf8");

    return JSON.parse(payload) as unknown;
  } catch {
    throw new InvalidAuthApiResponseError();
  }
}

export async function authenticateWithApi(
  credentials: AuthCredentials,
): Promise<AuthSession | null> {
  let response: Response;

  try {
    response = await fetch(tokenEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: credentials.username,
        password: credentials.password,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(30_000),
    });
  } catch {
    throw new AuthApiUnavailableError();
  }

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new AuthApiUnavailableError();
  }

  const responseBody: unknown = await response.json().catch(() => null);
  const tokenResult = tokenResponseSchema.safeParse(responseBody);

  if (!tokenResult.success) {
    throw new InvalidAuthApiResponseError();
  }

  const decodedPayload = decodeJwtPayload(tokenResult.data.access);
  const payloadResult = jwtPayloadSchema.safeParse(decodedPayload);

  if (!payloadResult.success) {
    throw new InvalidAuthApiResponseError();
  }

  if (payloadResult.data.exp * 1000 <= Date.now()) {
    throw new InvalidAuthApiResponseError();
  }

  const role = resolveAppRole(payloadResult.data.roles);

  console.log("api", payloadResult.data.username);
  return {
    user: {
      id: String(payloadResult.data.user_id),
      username: payloadResult.data.username,
      displayName: payloadResult.data.username,
      email: null,
      role,
    },
    tokens: {
      access: tokenResult.data.access,
      refresh: tokenResult.data.refresh,
    },
  };
}
