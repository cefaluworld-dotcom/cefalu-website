import { z } from "zod";
import { withApi, ok } from "@/lib/api-handler";
import { createUploadUrl } from "@/lib/s3";
import { audit } from "@/lib/logger";

const bodySchema = z.object({
  folder: z.enum(["products", "blog", "doctors", "reviews", "documents"]),
  contentType: z.enum(["image/jpeg", "image/png", "image/webp", "application/pdf", "video/mp4"]),
  filename: z.string().min(1).max(120),
});

export const dynamic = "force-dynamic";

/** Moderator+ presigned S3 upload URLs for product/blog/doctor media & documents. */
export const POST = withApi(
  { name: "admin-upload", bodySchema, role: "moderator", limit: 30 },
  async ({ body, actor }) => {
    const result = await createUploadUrl(body);
    audit("upload.presigned", { key: result.key, folder: body.folder, by: actor?.email });
    return ok(result);
  }
);
