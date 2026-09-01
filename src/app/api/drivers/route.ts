import { apiFetch, HttpError } from "@/lib/auth/client";

const maxFileSize = 20 * 1024 * 1024;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (file instanceof File) {
      if (file.size > maxFileSize) {
        return Response.json(
          { message: "File size must be under 20 MB." },
          { status: 400 },
        );
      }
    }

    const response = await apiFetch("/api/onboarding/drivers/", {
      method: "POST",
      body: formData,
    });

    return Response.json({
      message: "Created Driver.",
    });
  } catch (error) {
    if (error instanceof HttpError) {
      console.error("received ${error.status} from downstream:`", error.data);

      // 2. Handle Method Issues (405)
      if (error.status === 405) {
        return Response.json(
          {
            message: "This action is temporarily unavailable or misconfigured.",
          },
          { status: 502 },
        ); // Masking 405 as a 502 Bad Gateway to the client
      }
    }
    // 3. Fallback for other downstream API issues (e.g., 500, 403)
    return Response.json(
      {
        message: "An upstream service dependency failed.",
      },
      { status: 502 },
    );
  }
}
