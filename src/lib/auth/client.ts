// lib/api/client.ts

import { cookies } from "next/headers";

const API_URL = process.env.API_URL!;

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  const headers = new Headers(options.headers);

  // headers.set("Content-Type", "application/json");

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    cache: "no-store",
  });

  if (!response.ok) {
    let errorData = null;
    console.log("response is not ok");
    try {
      errorData = await response.json(); // Catch the 422/405 specific message
    } catch {
      errorData = { message: "Unknown downstream error" };
    }

    // 2. Throw the enhanced custom error
    throw new HttpError(response.status, errorData);
  }
  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export class HttpError extends Error {
  status: number;
  data: unknown;
  constructor(status: number, data: unknown) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.data = data; // This holds the 422 or 405 JSON payload from downstream
  }
}
