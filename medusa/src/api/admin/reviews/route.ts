import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { REVIEW_MODULE } from "../../../modules/review";
import type ReviewModuleService from "../../../modules/review/service";

/** GET /admin/reviews — moderation queue (all reviews incl. unapproved). */
export async function GET(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const service = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE);
  const reviews = await service.listReviews({}, { take: 100, order: { created_at: "DESC" } });
  res.json({ reviews });
}

const moderateBody = z.object({
  id: z.string().min(1),
  approved: z.boolean(),
});

/** POST /admin/reviews — approve/hide a review. */
export async function POST(req: MedusaRequest, res: MedusaResponse): Promise<void> {
  const parsed = moderateBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ message: "id and approved are required" });
    return;
  }
  const service = req.scope.resolve<ReviewModuleService>(REVIEW_MODULE);
  const review = await service.updateReviews({ id: parsed.data.id, approved: parsed.data.approved });
  res.json({ review });
}
