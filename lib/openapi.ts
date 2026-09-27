import { siteConfig } from "@/config/site";

/** Minimal typed OpenAPI 3.1 document (no runtime deps). */
export interface OpenApiSpec {
  openapi: "3.1.0";
  info: { title: string; version: string; description: string };
  servers: Array<{ url: string; description: string }>;
  tags: Array<{ name: string; description: string }>;
  paths: Record<string, Record<string, OpenApiOperation>>;
}

export interface OpenApiOperation {
  tags: string[];
  summary: string;
  description?: string;
  security?: Array<Record<string, string[]>>;
  parameters?: Array<{
    name: string;
    in: "query" | "header" | "path";
    required?: boolean;
    schema: { type: string; enum?: string[] };
    description?: string;
  }>;
  requestBody?: { required: boolean; contentType: string; example: Record<string, unknown> };
  responses: Record<string, { description: string }>;
}

const json = "application/json";
const sessionAuth = [{ session: [] }];

export const openApiSpec: OpenApiSpec = {
  openapi: "3.1.0",
  info: {
    title: "Cefalu API",
    version: "1.0.0",
    description:
      "Storefront, checkout, payments, account and admin endpoints. Rate-limited per IP; " +
      "session-cookie auth via Auth.js; admin/moderator roles from ADMIN_EMAILS / MODERATOR_EMAILS.",
  },
  servers: [{ url: siteConfig.url, description: "Production" }],
  tags: [
    { name: "Catalog", description: "Products & search" },
    { name: "Checkout", description: "Order math, payments, completion" },
    { name: "Payments", description: "Gateways, webhooks, status" },
    { name: "Auth", description: "Registration, passwords, verification" },
    { name: "Account", description: "Signed-in customer self-service" },
    { name: "Marketing", description: "Newsletter & contact" },
    { name: "Admin", description: "Moderator/admin operations" },
  ],
  paths: {
    "/api/products": {
      get: {
        tags: ["Catalog"],
        summary: "Cards by handle list",
        parameters: [
          { name: "handles", in: "query", required: true, schema: { type: "string" }, description: "Comma-separated product handles (max 12)" },
        ],
        responses: { "200": { description: "Ordered ProductCardData[]" } },
      },
    },
    "/api/search": {
      get: {
        tags: ["Catalog"],
        summary: "Instant search",
        parameters: [{ name: "q", in: "query", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "products + goal suggestions" } },
      },
    },
    "/api/checkout/razorpay": {
      post: {
        tags: ["Checkout"],
        summary: "Create Razorpay order",
        requestBody: {
          required: true,
          contentType: json,
          example: { email: "a@b.com", items: [{ variantId: "v_1", title: "Oxford Cotton Shirt", unitPrice: 1299, quantity: 1 }], couponCode: "WELCOME10", shippingMethod: "standard" },
        },
        responses: { "200": { description: "order + keyId" }, "422": { description: "Validation error" } },
      },
    },
    "/api/checkout/razorpay/verify": {
      post: {
        tags: ["Checkout"],
        summary: "Verify Razorpay payment signature",
        requestBody: { required: true, contentType: json, example: { razorpay_order_id: "o", razorpay_payment_id: "p", razorpay_signature: "s" } },
        responses: { "200": { description: "success + paymentId" }, "400": { description: "Bad signature" } },
      },
    },
    "/api/checkout/cashfree": {
      post: {
        tags: ["Checkout"],
        summary: "Create Cashfree order (hosted checkout URL)",
        requestBody: { required: true, contentType: json, example: { email: "a@b.com", phone: "9876543210", name: "Priya S", items: [], shippingMethod: "standard" } },
        responses: { "200": { description: "checkoutUrl + session" }, "502": { description: "Gateway not configured" } },
      },
    },
    "/api/checkout/complete": {
      post: {
        tags: ["Checkout"],
        summary: "Finalize order in Medusa after payment/COD",
        requestBody: { required: true, contentType: json, example: { email: "a@b.com", phone: "9876543210", address: {}, items: [], shippingMethod: "standard", paymentMethod: "cod", paymentReference: "COD-XYZ" } },
        responses: { "200": { description: "displayId + medusaOrder flag" } },
      },
    },
    "/api/payments/status": {
      get: {
        tags: ["Payments"],
        summary: "Gateway payment status (retry support)",
        parameters: [
          { name: "gateway", in: "query", required: true, schema: { type: "string", enum: ["razorpay", "cashfree"] } },
          { name: "orderId", in: "query", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "status + canRetry" } },
      },
    },
    "/api/webhooks/razorpay": {
      post: {
        tags: ["Payments"],
        summary: "Razorpay webhook (HMAC-verified)",
        parameters: [{ name: "x-razorpay-signature", in: "header", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "ACK" }, "400": { description: "Invalid signature" } },
      },
    },
    "/api/webhooks/cashfree": {
      post: {
        tags: ["Payments"],
        summary: "Cashfree webhook (HMAC-verified)",
        parameters: [
          { name: "x-webhook-signature", in: "header", required: true, schema: { type: "string" } },
          { name: "x-webhook-timestamp", in: "header", required: true, schema: { type: "string" } },
        ],
        responses: { "200": { description: "ACK" }, "400": { description: "Invalid signature" } },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register customer (triggers verification email)",
        requestBody: { required: true, contentType: json, example: { firstName: "Priya", lastName: "S", email: "a@b.com", password: "········" } },
        responses: { "200": { description: "success" }, "409": { description: "Email exists" } },
      },
    },
    "/api/auth/forgot": {
      post: {
        tags: ["Auth"],
        summary: "Start password reset (generic response)",
        requestBody: { required: true, contentType: json, example: { email: "a@b.com" } },
        responses: { "200": { description: "Always success" } },
      },
    },
    "/api/auth/reset": {
      post: {
        tags: ["Auth"],
        summary: "Complete password reset with emailed token",
        requestBody: { required: true, contentType: json, example: { email: "a@b.com", token: "…", password: "········" } },
        responses: { "200": { description: "success" }, "400": { description: "Invalid/expired token" } },
      },
    },
    "/api/auth/send-verification": {
      post: {
        tags: ["Auth"],
        summary: "Send email-verification link (24h JWT)",
        requestBody: { required: true, contentType: json, example: { email: "a@b.com" } },
        responses: { "200": { description: "sent" } },
      },
    },
    "/api/auth/verify-email": {
      get: {
        tags: ["Auth"],
        summary: "Verify token → redirects to /account",
        parameters: [{ name: "token", in: "query", required: true, schema: { type: "string" } }],
        responses: { "302": { description: "Redirect with status flag" } },
      },
    },
    "/api/account/profile": {
      patch: {
        tags: ["Account"],
        summary: "Update name/phone",
        security: sessionAuth,
        requestBody: { required: true, contentType: json, example: { firstName: "Priya", lastName: "S", phone: "9876543210" } },
        responses: { "200": { description: "success" }, "401": { description: "Sign in required" } },
      },
    },
    "/api/account/addresses": {
      post: {
        tags: ["Account"],
        summary: "Add address",
        security: sessionAuth,
        requestBody: { required: true, contentType: json, example: { firstName: "Priya", lastName: "S", address1: "…", city: "Mumbai", state: "MH", pincode: "400001", phone: "9876543210" } },
        responses: { "200": { description: "success" } },
      },
      delete: {
        tags: ["Account"],
        summary: "Remove address",
        security: sessionAuth,
        parameters: [{ name: "id", in: "query", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "success" } },
      },
    },
    "/api/account/delete": {
      post: {
        tags: ["Account"],
        summary: "Delete account (typed confirmation)",
        security: sessionAuth,
        requestBody: { required: true, contentType: json, example: { confirm: "DELETE" } },
        responses: { "200": { description: "deleted" }, "501": { description: "Backend lacks self-serve deletion" } },
      },
    },
    "/api/newsletter": {
      post: {
        tags: ["Marketing"],
        summary: "Subscribe to the journal",
        requestBody: { required: true, contentType: json, example: { email: "a@b.com" } },
        responses: { "200": { description: "subscribed" } },
      },
    },
    "/api/contact": {
      post: {
        tags: ["Marketing"],
        summary: "Contact form",
        requestBody: { required: true, contentType: json, example: { name: "Priya", email: "a@b.com", subject: "Order help", message: "…" } },
        responses: { "200": { description: "received" } },
      },
    },
    "/api/admin/dashboard": {
      get: { tags: ["Admin"], summary: "Totals, recent orders, daily sales", security: sessionAuth, responses: { "200": { description: "DashboardStats" }, "403": { description: "Admin only" } } },
    },
    "/api/admin/orders": {
      get: {
        tags: ["Admin"], summary: "List orders", security: sessionAuth,
        parameters: [
          { name: "limit", in: "query", schema: { type: "integer" } },
          { name: "offset", in: "query", schema: { type: "integer" } },
          { name: "status", in: "query", schema: { type: "string" } },
        ],
        responses: { "200": { description: "orders + count" } },
      },
    },
    "/api/admin/customers": {
      get: { tags: ["Admin"], summary: "List/search customers", security: sessionAuth, parameters: [{ name: "q", in: "query", schema: { type: "string" } }], responses: { "200": { description: "customers + count" } } },
    },
    "/api/admin/products": {
      get: { tags: ["Admin"], summary: "List products (variants)", security: sessionAuth, responses: { "200": { description: "products + count" } } },
    },
    "/api/admin/inventory": {
      get: { tags: ["Admin"], summary: "Stock levels per location", security: sessionAuth, responses: { "200": { description: "items + levels" } } },
    },
    "/api/admin/coupons": {
      get: { tags: ["Admin"], summary: "Coupon catalog", security: sessionAuth, responses: { "200": { description: "coupons" } } },
    },
    "/api/admin/reports/sales": {
      get: { tags: ["Admin"], summary: "Sales report (N-day window + AOV)", security: sessionAuth, parameters: [{ name: "days", in: "query", schema: { type: "integer" } }], responses: { "200": { description: "series + totals" } } },
    },
    "/api/admin/refunds": {
      post: {
        tags: ["Admin"], summary: "Initiate Razorpay refund", security: sessionAuth,
        requestBody: { required: true, contentType: json, example: { paymentId: "pay_…", amountRupees: 500, reason: "Damaged pack" } },
        responses: { "200": { description: "refundId + status" }, "403": { description: "Admin only" } },
      },
    },
    "/api/admin/uploads": {
      post: {
        tags: ["Admin"], summary: "Presigned S3 upload URL", security: sessionAuth,
        requestBody: { required: true, contentType: json, example: { folder: "products", contentType: "image/webp", filename: "oxford-shirt-front" } },
        responses: { "200": { description: "uploadUrl + publicUrl" } },
      },
    },
  },
};
