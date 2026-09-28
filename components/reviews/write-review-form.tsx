"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Star } from "lucide-react";
import type { ReviewEntry } from "@/types";
import { addReview } from "@/services/reviews";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";

const schema = z.object({
  author: z.string().min(2, "Enter your name"),
  rating: z.number().int().min(1, "Pick a star rating").max(5),
  title: z.string().min(3, "Add a short headline"),
  body: z.string().min(20, "Tell us a bit more (min. 20 characters)").max(1500),
  photo: z.string().url("Enter a valid image URL").optional().or(z.literal("")),
  video: z.string().url("Enter a valid video URL").optional().or(z.literal("")),
});

type Values = z.infer<typeof schema>;

export function WriteReviewForm({ handle, onSubmitted }: { handle: string; onSubmitted: (r: ReviewEntry) => void }) {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { author: "", rating: 0, title: "", body: "", photo: "", video: "" },
  });
  const rating = form.watch("rating");

  function onSubmit(values: Values) {
    const review: ReviewEntry = {
      id: `${handle}-${Date.now().toString(36)}`,
      productHandle: handle,
      author: values.author,
      rating: values.rating as ReviewEntry["rating"],
      title: values.title,
      body: values.body,
      date: new Date().toISOString(),
      verified: false,
      photos: values.photo ? [values.photo] : [],
      videos: values.video ? [values.video] : [],
      helpful: 0,
    };
    addReview(review);
    onSubmitted(review);
    toast.success("Review published", { description: "Thanks for helping other customers." });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border bg-card p-6" noValidate>
        <h3 className="font-display text-lg font-bold">Write a review</h3>

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your rating</FormLabel>
              <FormControl>
                <div role="radiogroup" aria-label="Star rating" className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                      onClick={() => field.onChange(star)}
                      className="p-0.5"
                    >
                      <Star
                        className={cn(
                          "size-7 transition-colors",
                          star <= rating ? "fill-gold-500 text-gold-500" : "text-gold-500/30 hover:text-gold-500/60"
                        )}
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl><Input placeholder="Priya S." {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headline</FormLabel>
                <FormControl><Input placeholder="Energy is back" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your review</FormLabel>
              <FormControl><Textarea placeholder="What changed after using it?" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Photo URL (optional)</FormLabel>
              <FormControl><Input type="url" placeholder="https://…/my-photo.jpg" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="video"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video URL (optional)</FormLabel>
              <FormControl><Input type="url" placeholder="https://…/my-review.mp4" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>

        <Button type="submit" isLoading={form.formState.isSubmitting}>Publish review</Button>
      </form>
    </Form>
  );
}
