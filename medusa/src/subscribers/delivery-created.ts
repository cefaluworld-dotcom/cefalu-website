import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { sendEmail, templates } from "../lib/email";
import { sendSms, smsTemplates } from "../lib/sms";

export default async function deliveryCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "fulfillment",
    fields: ["order.display_id", "order.email", "order.shipping_address.phone"],
    filters: { id: event.data.id },
  });
  const order = data[0]?.order;
  if (!order?.email) return;

  await sendEmail({
    to: order.email,
    subject: `Order #${order.display_id} delivered ✅`,
    html: templates.orderDelivered({ displayId: order.display_id }),
  });

  const phone = order.shipping_address?.phone?.replace(/\D/g, "").slice(-10);
  if (phone && smsTemplates.orderDelivered) {
    await sendSms({
      mobile: phone,
      templateId: smsTemplates.orderDelivered,
      variables: { order_id: String(order.display_id) },
    });
  }
}

export const config: SubscriberConfig = { event: "delivery.created" };
