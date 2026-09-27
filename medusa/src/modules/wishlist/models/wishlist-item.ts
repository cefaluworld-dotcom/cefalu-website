import { model } from "@medusajs/framework/utils";

export const WishlistItem = model
  .define("wishlist_item", {
    id: model.id().primaryKey(),
    customer_id: model.text().index("IDX_wishlist_customer"),
    product_handle: model.text(),
    variant_id: model.text().nullable(),
    title: model.text(),
    thumbnail: model.text().nullable(),
    unit_price: model.number().default(0),
  })
  .indexes([{ on: ["customer_id", "product_handle"], unique: true }]);
