import { apiFetch, HttpError } from "@/lib/auth/client";
import { extname } from "node:path";

const allowedExtensions = new Set([".png", ".jpg", ".pdf", ".webp"]);
const maxFileSize = 10 * 1024 * 1024;

function makeSafeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size === 0) {
      return Response.json(
        { message: "Please select a file." },
        { status: 400 },
      );
    }

    if (file.size > maxFileSize) {
      return Response.json(
        { message: "File size must be under 10 MB." },
        { status: 400 },
      );
    }

    const extension = extname(file.name).toLowerCase();

    if (!allowedExtensions.has(extension)) {
      return Response.json(
        { message: "Only .png, .jpg, .pdf and .webp files are supported." },
        { status: 400 },
      );
    }

    const response = await apiFetch("/api/business/contracts/", {
      method: "POST",
      body: formData,
    });

    return Response.json({
      message: "Upload successful.",
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
