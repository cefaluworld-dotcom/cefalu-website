"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/constants";
import { safeInternalPath } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

type Values = z.infer<typeof schema>;

export function LoginForm({ className }: { className?: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeInternalPath(searchParams.get("callbackUrl"), ROUTES.account);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    const result = await signIn("credentials", { ...values, redirect: false });
    if (result?.error) {
      toast.error("Sign in failed", { description: "Check your email and password." });
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} noValidate>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" autoComplete="email" placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" autoComplete="current-password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="lg" className="mt-6 w-full" isLoading={form.formState.isSubmitting}>
          Sign in
        </Button>
      </form>
    </Form>
  );
}
