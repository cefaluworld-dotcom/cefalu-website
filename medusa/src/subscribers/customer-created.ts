import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { sendEmail, templates } from "../lib/email";

export default async function customerCreatedHandler({
  event,
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const { data } = await query.graph({
    entity: "customer",
    fields: ["email", "first_name"],
    filters: { id: event.data.id },
  });
  const customer = data[0];
  if (!customer?.email) return;
  await sendEmail({
    to: customer.email,
    subject: "Welcome to Cefalu 🌿",
    html: templates.welcome(customer.first_name ?? "there"),
  });
}

export const config: SubscriberConfig = { event: "customer.created" };
