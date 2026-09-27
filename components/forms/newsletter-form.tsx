"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const newsletterSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
});

type NewsletterValues = z.infer<typeof newsletterSchema>;

export function NewsletterForm({
  className,
  variant = "light",
}: {
  className?: string;
  variant?: "light" | "dark";
}) {
  const [subscribed, setSubscribed] = useState(false);

  const form = useForm<NewsletterValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: NewsletterValues) {
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { success: boolean; error?: string };

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Subscription failed. Try again.");
      }

      setSubscribed(true);
      toast.success("Subscribed", {
        description: "We'll let you know when new collections land.",
      });
    } catch (error) {
      toast.error("Couldn't subscribe", {
        description: error instanceof Error ? error.message : "Try again in a moment.",
      });
    }
  }

  if (subscribed) {
    return (
      <p
        className={cn(
          "flex items-center justify-center gap-2 text-sm font-medium",
          variant === "dark" ? "text-gold-300" : "text-success",
          className
        )}
        role="status"
      >
        <CheckCircle2 className="size-5" />
        You&apos;re in. Check your inbox for a welcome note.
      </p>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("flex w-full max-w-md flex-col gap-2 sm:flex-row", className)}
        noValidate
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Your email address"
                  aria-label="Email address"
                  className={cn(
                    variant === "dark" &&
                      "border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-gold-400"
                  )}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          isLoading={form.formState.isSubmitting}
          variant={variant === "dark" ? "accent" : "default"}
          className="sm:shrink-0"
        >
          Subscribe
          <ArrowRight />
        </Button>
      </form>
    </Form>
  );
}
