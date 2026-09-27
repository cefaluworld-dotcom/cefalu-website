"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Script from "next/script";
import { useSession } from "next-auth/react";
import { ArrowLeft, ArrowRight, Banknote, CreditCard, Landmark, Lock, Pencil, Truck, UserRound, Zap } from "lucide-react";
import type { CartLine } from "@/types";
import {
  COD_FEE, COUPONS, FREE_SHIPPING_THRESHOLD, ROUTES, SHIPPING_EXPRESS, SHIPPING_FLAT,
} from "@/constants";
import { useCartStore, selectSubtotal } from "@/store/cart-store";
import { useMounted } from "@/hooks/use-mounted";
import { formatPrice } from "@/utils/format";
import { quoteOrder } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckoutStepper } from "@/components/forms/checkout-steps";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

const checkoutSchema = z.object({
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  address1: z.string().min(5, "Enter your street address"),
  address2: z.string().optional(),
  city: z.string().min(2, "Required"),
  state: z.string().min(2, "Required"),
  pincode: z.string().regex(/^[1-9]\d{5}$/, "Enter a valid 6-digit PIN code"),
  shippingMethod: z.enum(["standard", "express"]),
  paymentMethod: z.enum(["razorpay", "cashfree", "cod"]),
});

type CheckoutValues = z.infer<typeof checkoutSchema>;

const STEP_FIELDS: Array<Array<keyof CheckoutValues>> = [
  ["email", "phone"],
  ["firstName", "lastName", "address1", "city", "state", "pincode"],
  ["shippingMethod"],
  ["paymentMethod"],
  [],
];

export function CheckoutView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const mounted = useMounted();
  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(selectSubtotal);
  const clearCart = useCartStore((s) => s.clearCart);
  const [step, setStep] = useState(0);

  const couponCode = (searchParams.get("coupon") ?? "").toUpperCase();
  const coupon = useMemo(
    () => (COUPONS[couponCode] ? { code: couponCode, percentOff: COUPONS[couponCode].percentOff } : null),
    [couponCode]
  );

  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: session?.user?.email ?? "",
      phone: "",
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      pincode: "",
      shippingMethod: "standard",
      paymentMethod: "razorpay",
    },
  });

  const values = form.watch();
  // Same engine the payment APIs use, so what the shopper sees is exactly what is charged.
  const quote = useMemo(
    () =>
      quoteOrder({
        items: items.map((i: CartLine) => ({ unitPrice: i.unitPrice, quantity: i.quantity })),
        couponCode: coupon?.code,
        shippingMethod: values.shippingMethod,
        paymentMethod: values.paymentMethod,
      }),
    [items, coupon, values.shippingMethod, values.paymentMethod]
  );
  const { discount, afterDiscount, shipping, codFee, total, gstIncluded } = quote;

  const payable = useMemo(
    () =>
      items.map((i: CartLine) => ({
        variantId: i.variantId,
        title: i.title,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
    [items]
  );

  async function nextStep() {
    const fields = STEP_FIELDS[step] ?? [];
    const valid = await form.trigger(fields, { shouldFocus: true });
    if (valid) setStep((s) => Math.min(s + 1, 4));
  }

  async function completeOrder(reference: string) {
    const v = form.getValues();
    let display = reference;
    try {
      const res = await fetch("/api/checkout/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: v.email,
          phone: v.phone,
          address: {
            firstName: v.firstName,
            lastName: v.lastName,
            address1: v.address1,
            address2: v.address2,
            city: v.city,
            state: v.state,
            pincode: v.pincode,
          },
          items: payable,
          shippingMethod: v.shippingMethod,
          paymentMethod: v.paymentMethod,
          couponCode: coupon?.code,
          paymentReference: reference,
        }),
      });
      const data = (await res.json()) as { success: boolean; displayId?: string };
      if (data.success && data.displayId) display = data.displayId;
    } catch {
      /* fall back to gateway reference */
    }
    clearCart();
    router.push(`${ROUTES.orderConfirmed}?ref=${encodeURIComponent(display)}`);
  }

  function failOrder(reason: string) {
    router.push(`${ROUTES.orderFailed}?reason=${encodeURIComponent(reason)}`);
  }

  async function payWithRazorpay(v: CheckoutValues) {
    const res = await fetch("/api/checkout/razorpay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: v.email, items: payable, couponCode: coupon?.code, shippingMethod: v.shippingMethod }),
    });
    const data = (await res.json()) as {
      success: boolean; error?: string;
      order?: { id: string; amount: number; currency: string }; keyId?: string;
    };

    if (!data.success || !data.order || !data.keyId) throw new Error(data.error ?? "Couldn't initiate payment.");
    if (!window.Razorpay) throw new Error("Payment gateway is still loading. Please try again.");

    new window.Razorpay({
      key: data.keyId,
      order_id: data.order.id,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Cefalu",
      description: "Cefalu order",
      prefill: { name: `${v.firstName} ${v.lastName}`, email: v.email, contact: v.phone },
      notes: { pincode: v.pincode },
      theme: { color: "#1F4E9E" },
      modal: { ondismiss: () => failOrder("Payment window closed before completion.") },
      handler: async (response: {
        razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string;
      }) => {
        const verifyRes = await fetch("/api/checkout/razorpay/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(response),
        });
        const verify = (await verifyRes.json()) as { success: boolean; paymentId?: string };
        if (verify.success && verify.paymentId) {
          toast.success("Payment successful");
          completeOrder(verify.paymentId);
        } else {
          failOrder("Payment signature verification failed. Any deduction auto-refunds in 5–7 days.");
        }
      },
    }).open();
  }

  async function payWithCashfree(v: CheckoutValues) {
    const res = await fetch("/api/checkout/cashfree", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: v.email,
        phone: v.phone,
        name: `${v.firstName} ${v.lastName}`,
        items: payable,
        couponCode: coupon?.code,
        shippingMethod: v.shippingMethod,
      }),
    });
    const data = (await res.json()) as { success: boolean; error?: string; checkoutUrl?: string };
    if (!data.success || !data.checkoutUrl) throw new Error(data.error ?? "Couldn't start Cashfree checkout.");
    window.location.assign(data.checkoutUrl);
  }

  async function onSubmit(v: CheckoutValues) {
    try {
      if (v.paymentMethod === "cashfree") {
        await payWithCashfree(v);
        return;
      }
      if (v.paymentMethod === "cod") {
        toast.success("Order placed", { description: "Pay on delivery. Keep exact change handy!" });
        completeOrder(`COD-${Date.now().toString(36).toUpperCase()}`);
        return;
      }
      await payWithRazorpay(v);
    } catch (error) {
      toast.error("Checkout failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    }
  }

  if (!mounted) {
    return (
      <div className="grid gap-8 lg:grid-cols-5">
        <Skeleton className="h-96 lg:col-span-3" />
        <Skeleton className="h-96 lg:col-span-2" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed p-12 text-center">
        <p className="font-display text-lg font-semibold">Nothing to check out</p>
        <p className="mt-1 text-sm text-muted-foreground">Your cart is empty.</p>
        <Button asChild className="mt-5">
          <Link href={ROUTES.shop}>Browse products</Link>
        </Button>
      </div>
    );
  }

  const fieldInput = (
    name: keyof CheckoutValues, label: string,
    props: React.ComponentProps<typeof Input> = {}, span2 = false
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={span2 ? "sm:col-span-2" : undefined}>
          <FormLabel>{label}</FormLabel>
          <FormControl><Input {...props} {...field} /></FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div className="mx-auto mb-8 max-w-2xl"><CheckoutStepper current={step} /></div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid items-start gap-8 lg:grid-cols-5" noValidate>
          <div className="lg:col-span-3">
            {step === 0 && (
              <fieldset className="rounded-2xl border bg-card p-6">
                <legend className="px-2 font-display text-base font-bold">Contact</legend>
                {status !== "authenticated" && (
                  <p className="mb-4 flex items-center gap-2 rounded-xl bg-surface px-4 py-3 text-sm">
                    <UserRound className="size-4 text-primary" aria-hidden="true" />
                    Checking out as guest.{" "}
                    <Link href={`${ROUTES.login}?callbackUrl=${ROUTES.checkout}`} className="link-underline font-semibold text-primary">
                      Sign in
                    </Link>{" "}
                    for faster checkout.
                  </p>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                  {fieldInput("email", "Email", { type: "email", autoComplete: "email" })}
                  {fieldInput("phone", "Mobile number", { type: "tel", inputMode: "numeric", autoComplete: "tel", maxLength: 10 })}
                </div>
              </fieldset>
            )}

            {step === 1 && (
              <fieldset className="rounded-2xl border bg-card p-6">
                <legend className="px-2 font-display text-base font-bold">Shipping address</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {fieldInput("firstName", "First name", { autoComplete: "given-name" })}
                  {fieldInput("lastName", "Last name", { autoComplete: "family-name" })}
                  {fieldInput("address1", "Address line 1", { autoComplete: "address-line1", placeholder: "Flat, building, street" }, true)}
                  {fieldInput("address2", "Address line 2 (optional)", { autoComplete: "address-line2", placeholder: "Landmark, area" }, true)}
                  {fieldInput("city", "City", { autoComplete: "address-level2" })}
                  {fieldInput("state", "State", { autoComplete: "address-level1" })}
                  {fieldInput("pincode", "PIN code", { inputMode: "numeric", autoComplete: "postal-code", maxLength: 6 })}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <fieldset className="rounded-2xl border bg-card p-6">
                <legend className="px-2 font-display text-base font-bold">Shipping method</legend>
                <FormField
                  control={form.control}
                  name="shippingMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                          <FormLabel htmlFor="ship-standard" className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60">
                            <RadioGroupItem value="standard" id="ship-standard" />
                            <Truck className="size-5 text-primary" aria-hidden="true" />
                            <span className="flex-1">
                              <span className="block text-sm font-semibold">Standard · 2–5 business days</span>
                              <span className="text-xs text-muted-foreground">
                                {afterDiscount >= FREE_SHIPPING_THRESHOLD ? "Free on this order" : formatPrice(SHIPPING_FLAT)}
                              </span>
                            </span>
                          </FormLabel>
                          <FormLabel htmlFor="ship-express" className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60">
                            <RadioGroupItem value="express" id="ship-express" />
                            <Zap className="size-5 text-gold-600" aria-hidden="true" />
                            <span className="flex-1">
                              <span className="block text-sm font-semibold">Express · 1–2 business days</span>
                              <span className="text-xs text-muted-foreground">{formatPrice(SHIPPING_EXPRESS)} · select cities</span>
                            </span>
                          </FormLabel>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
            )}

            {step === 3 && (
              <fieldset className="rounded-2xl border bg-card p-6">
                <legend className="px-2 font-display text-base font-bold">Payment</legend>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup value={field.value} onValueChange={field.onChange} className="gap-3">
                          <FormLabel htmlFor="pay-razorpay" className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60">
                            <RadioGroupItem value="razorpay" id="pay-razorpay" />
                            <CreditCard className="size-5 text-primary" aria-hidden="true" />
                            <span>
                              <span className="block text-sm font-semibold">UPI · Cards · Net Banking · Wallets</span>
                              <span className="text-xs text-muted-foreground">Secured by Razorpay</span>
                            </span>
                          </FormLabel>
                          <FormLabel htmlFor="pay-cashfree" className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60">
                            <RadioGroupItem value="cashfree" id="pay-cashfree" />
                            <Landmark className="size-5 text-primary" aria-hidden="true" />
                            <span>
                              <span className="block text-sm font-semibold">Cashfree · UPI · EMI · Pay Later</span>
                              <span className="text-xs text-muted-foreground">Hosted secure checkout</span>
                            </span>
                          </FormLabel>
                          <FormLabel htmlFor="pay-cod" className="flex cursor-pointer items-center gap-3 rounded-xl border p-4 font-normal transition-colors has-[[data-state=checked]]:border-primary has-[[data-state=checked]]:bg-secondary/60">
                            <RadioGroupItem value="cod" id="pay-cod" />
                            <Banknote className="size-5 text-primary" aria-hidden="true" />
                            <span>
                              <span className="block text-sm font-semibold">Cash on Delivery</span>
                              <span className="text-xs text-muted-foreground">+{formatPrice(COD_FEE)} handling fee</span>
                            </span>
                          </FormLabel>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="rounded-2xl border bg-card p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display text-base font-bold">Review your order</h3>
                  </div>
                  <dl className="mt-4 space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Contact</dt>
                      <dd className="text-right">{values.email}<br />{values.phone}</dd>
                    </div>
                    <Separator />
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Ship to</dt>
                      <dd className="text-right">
                        {values.firstName} {values.lastName}<br />
                        {values.address1}{values.address2 ? `, ${values.address2}` : ""}<br />
                        {values.city}, {values.state} {values.pincode}
                      </dd>
                    </div>
                    <Separator />
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-muted-foreground">Method</dt>
                      <dd className="text-right capitalize">
                        {values.shippingMethod} delivery · {values.paymentMethod === "cod" ? "Cash on Delivery" : values.paymentMethod === "cashfree" ? "Cashfree" : "Razorpay"}
                      </dd>
                    </div>
                  </dl>
                  <Button type="button" variant="ghost" size="sm" className="mt-4 px-0" onClick={() => setStep(0)}>
                    <Pencil aria-hidden="true" /> Edit details
                  </Button>
                </div>
              </div>
            )}

            <div className="mt-6 flex items-center justify-between">
              {step > 0 ? (
                <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
                  <ArrowLeft aria-hidden="true" /> Back
                </Button>
              ) : <span />}
              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Continue <ArrowRight aria-hidden="true" />
                </Button>
              ) : (
                <Button type="submit" size="lg" isLoading={form.formState.isSubmitting}>
                  <Lock aria-hidden="true" />
                  {values.paymentMethod === "cod" ? "Place order" : `Pay ${formatPrice(total)}`}
                </Button>
              )}
            </div>
          </div>

          <aside className="rounded-2xl border bg-card p-6 lg:sticky lg:top-24 lg:col-span-2" aria-label="Order summary">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <ul className="mt-4 space-y-3">
              {items.map((line) => (
                <li key={line.variantId} className="flex justify-between gap-3 text-sm">
                  <span className="line-clamp-1 text-muted-foreground">{line.title} × {line.quantity}</span>
                  <span className="shrink-0 font-semibold">{formatPrice(line.unitPrice * line.quantity)}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd className="font-semibold">{formatPrice(subtotal)}</dd>
              </div>
              {coupon && (
                <div className="flex justify-between text-success">
                  <dt>{coupon.code} ({coupon.percentOff}%)</dt>
                  <dd className="font-semibold">−{formatPrice(discount)}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Shipping</dt>
                <dd className="font-semibold">
                  {shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}
                </dd>
              </div>
              {codFee > 0 && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">COD fee</dt>
                  <dd className="font-semibold">{formatPrice(codFee)}</dd>
                </div>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <dt>GST (18%) included</dt>
                <dd>{formatPrice(gstIncluded)}</dd>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <dt className="font-bold">Total</dt>
                <dd className="font-bold">{formatPrice(total)}</dd>
              </div>
            </dl>
            <p className="mt-4 flex items-center justify-center gap-1.5 text-2xs text-muted-foreground">
              <Lock className="size-3" aria-hidden="true" /> 256-bit SSL encrypted · PCI-DSS compliant gateway
            </p>
          </aside>
        </form>
      </Form>
    </>
  );
}
