"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { ROUTES } from "@/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Minimum 8 characters"),
});

type Values = z.infer<typeof schema>;

export function RegisterForm({ className }: { className?: string }) {
  const router = useRouter();

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: "", lastName: "", email: "", password: "" },
  });

  async function onSubmit(values: Values) {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = (await res.json()) as { success: boolean; error?: string };

    if (!data.success) {
      toast.error("Couldn't create account", { description: data.error });
      return;
    }

    const result = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    toast.success("Account created", { description: "Welcome to Cefalu." });
    router.push(result?.error ? ROUTES.login : ROUTES.account);
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className} noValidate>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input autoComplete="given-name" placeholder="Priya" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input autoComplete="family-name" placeholder="Sharma" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                  <Input type="password" autoComplete="new-password" placeholder="Min. 8 characters" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" size="lg" className="mt-6 w-full" isLoading={form.formState.isSubmitting}>
          Create account
        </Button>
        <p className="mt-3 text-center text-2xs text-muted-foreground">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>
    </Form>
  );
}
