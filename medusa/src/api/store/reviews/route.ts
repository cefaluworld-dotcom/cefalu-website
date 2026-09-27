import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { REVIEW_MODULE } from "../../../modules/review";
import type ReviewModuleService from "../../../modules/review/service";

const listQuery = z.object({
  handle: z.string().min(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  offset: z.coerce.number().int().min(0).default(0),
});

/** GET /store/reviews?handle=… — approved reviews + summary for a product. */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const parsed = listQuery.safeParse(req.query);
  if (!parsed.success) {
    res.status(422).json({ message: parsed.error.issues[0]?.message ?? "Invalid query" });
    return;
  }
  const service = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE);
  const [reviews, summary] = await Promise.all([
    service.listReviews(
      { product_handle: parsed.data.handle, approved: true },
      { take: parsed.data.limit, skip: parsed.data.offset, order: { created_at: "DESC" } }
    ),
    service.summarize(parsed.data.handle),
  ]);
  res.json({ reviews, summary });
}

const createBody = z.object({
  handle: z.string().min(1),
  author: z.string().min(2).max(100),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(150),
  body: z.string().min(20).max(2000),
  photos: z.array(z.string().url()).max(4).default([]),
  videos: z.array(z.string().url()).max(2).default([]),
});

/** POST /store/reviews — create a review (verified when the caller is an authenticated customer). */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const parsed = createBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ message: parsed.error.issues[0]?.message ?? "Invalid input" });
    return;
  }
  const customerId =
    (req as MedusaRequest & { auth_context?: { actor_id?: string } }).auth_context?.actor_id ?? null;

  const service = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE);
  const review = await service.createReviews({
    product_handle: parsed.data.handle,
    customer_id: customerId,
    author: parsed.data.author,
    rating: parsed.data.rating,
    title: parsed.data.title,
    body: parsed.data.body,
    photos: parsed.data.photos,
    videos: parsed.data.videos,
    verified: Boolean(customerId),
    approved: true,
    helpful: 0,
  });
  res.status(201).json({ review });
}
