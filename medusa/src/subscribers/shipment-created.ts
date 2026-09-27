import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { sendEmail, templates } from "../lib/email";
import { sendSms, smsTemplates } from "../lib/sms";

export default async function shipmentCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string; no_notification?: boolean }>) {
  if (event.data.no_notification) return;
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "fulfillment",
    fields: ["labels.tracking_number", "order.display_id", "order.email", "order.shipping_address.phone"],
    filters: { id: event.data.id },
  });
  const fulfillment = data[0];
  const order = fulfillment?.order;
  if (!order?.email) return;

  const tracking = fulfillment?.labels?.[0]?.tracking_number ?? undefined;
  await sendEmail({
    to: order.email,
    subject: `Order #${order.display_id} shipped 🚚`,
    html: templates.orderShipped({ displayId: order.display_id, tracking }),
  });

  const phone = order.shipping_address?.phone?.replace(/\D/g, "").slice(-10);
  if (phone && smsTemplates.orderShipped) {
    await sendSms({
      mobile: phone,
      templateId: smsTemplates.orderShipped,
      variables: { order_id: String(order.display_id), tracking: tracking ?? "-" },
    });
  }
}

export const config: SubscriberConfig = { event: "shipment.created" };
