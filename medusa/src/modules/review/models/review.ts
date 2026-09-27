import { model } from "@medusajs/framework/utils";

export const Review = model
  .define("review", {
    id: model.id().primaryKey(),
    product_handle: model.text().index("IDX_review_product_handle"),
    customer_id: model.text().nullable(),
    author: model.text(),
    rating: model.number(),
    title: model.text(),
    body: model.text(),
    // URL lists — text[] columns (DML json defaults must be objects, so arrays use model.array()).
    photos: model.array().default([]),
    videos: model.array().default([]),
    verified: model.boolean().default(false),
    approved: model.boolean().default(true),
    helpful: model.number().default(0),
  })
  .indexes([{ on: ["product_handle", "approved"] }]);
