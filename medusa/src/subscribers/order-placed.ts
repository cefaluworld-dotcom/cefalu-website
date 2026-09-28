import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { sendEmail, templates, inr } from "../lib/email";
import { sendSms, smsTemplates } from "../lib/sms";

export default async function orderPlacedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "order",
    fields: ["display_id", "email", "total", "items.title", "items.quantity", "items.total", "shipping_address.phone"],
    filters: { id: event.data.id },
  });
  const order = data[0];
  if (!order?.email) return;

  const itemsHtml = (order.items ?? [])
    .filter((i) => i != null)
    .map((i) =>
      `<div style="display:flex;justify-content:space-between;font-size:14px;color:#1F2937;padding:4px 0">
         <span>${i.title ?? "Item"} × ${i.quantity ?? 0}</span><span style="font-weight:600">${inr(Number(i.total ?? 0))}</span>
       </div>`
    )
    .join("");

  await sendEmail({
    to: order.email,
    subject: `Order #${order.display_id} confirmed — Cefalu`,
    html: templates.orderConfirmation({
      displayId: order.display_id ?? "",
      total: inr(order.total ?? 0),
      itemsHtml,
    }),
  });

  const phone = order.shipping_address?.phone?.replace(/\D/g, "").slice(-10);
  if (phone && smsTemplates.orderPlaced) {
    await sendSms({
      mobile: phone,
      templateId: smsTemplates.orderPlaced,
      variables: { order_id: String(order.display_id), amount: String(order.total ?? 0) },
    });
  }
}

export const config: SubscriberConfig = { event: "order.placed" };
