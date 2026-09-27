"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MessageCircleQuestion } from "lucide-react";
import type { QuestionEntry } from "@/types";
import { addQuestion, getQuestions } from "@/services/reviews";
import { useMounted } from "@/hooks/use-mounted";
import { formatDate } from "@/utils/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/sonner";

const schema = z.object({
  author: z.string().min(2, "Enter your name"),
  question: z.string().min(10, "Ask a fuller question (min. 10 characters)").max(500),
});

type Values = z.infer<typeof schema>;

export function QaSection({ handle }: { handle: string }) {
  const mounted = useMounted();
  const [extra, setExtra] = useState<QuestionEntry[]>([]);
  const questions = useMemo(() => (mounted ? [...extra, ...getQuestions(handle)] : []), [mounted, extra, handle]);

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { author: "", question: "" } });

  function onSubmit(values: Values) {
    const entry: QuestionEntry = {
      id: `${handle}-q${Date.now().toString(36)}`,
      productHandle: handle,
      author: values.author,
      question: values.question,
      date: new Date().toISOString(),
    };
    addQuestion(entry);
    setExtra((e) => [entry, ...e]);
    toast.success("Question posted", { description: "Our nutrition team replies within 1–2 business days." });
    form.reset();
  }

  if (!mounted) return <Skeleton className="h-40 rounded-2xl" />;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Questions &amp; answers</h2>

      {questions.length === 0 ? (
        <p className="rounded-2xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          No questions yet — ask the first one below.
        </p>
      ) : (
        <ul className="space-y-4">
          {questions.map((q) => (
            <li key={q.id} className="rounded-2xl border bg-card p-5">
              <p className="flex items-start gap-2 text-sm font-bold">
                <MessageCircleQuestion className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                {q.question}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {q.author} · <time dateTime={q.date}>{formatDate(q.date)}</time>
              </p>
              {q.answer ? (
                <p className="mt-3 rounded-xl bg-surface p-3 text-sm leading-relaxed">
                  <strong className="text-primary">Cefalu team:</strong> {q.answer}
                </p>
              ) : (
                <p className="mt-3 text-xs italic text-muted-foreground">Awaiting answer from our nutrition team.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border bg-card p-6" noValidate>
          <h3 className="font-display text-base font-bold">Ask a question</h3>
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl><Input placeholder="Amit" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your question</FormLabel>
                  <FormControl><Textarea rows={2} placeholder="Can I take this with…?" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" size="sm" isLoading={form.formState.isSubmitting}>Post question</Button>
        </form>
      </Form>
    </div>
  );
}
