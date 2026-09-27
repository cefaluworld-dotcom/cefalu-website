import { MedusaService } from "@medusajs/framework/utils";
import { Review } from "./models/review";

class ReviewModuleService extends MedusaService({ Review }) {
  async summarize(productHandle: string) {
    const reviews = await this.listReviews({ product_handle: productHandle, approved: true });
    const count = reviews.length;
    const sum = reviews.reduce((s, r) => s + r.rating, 0);
    return { count, average: count ? Math.round((sum / count) * 10) / 10 : 0 };
  }
}

export default ReviewModuleService;
