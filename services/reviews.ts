"use client";

import type { QuestionEntry, ReviewEntry } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { SEED_QUESTIONS, SEED_REVIEWS } from "@/constants/catalog-content";

/**
 * Review/Q&A adapter. Reads seed content + user-submitted entries persisted in
 * localStorage; swap the internals for a Medusa/HTTP backend without touching UI.
 */

type Stored<T> = Record<string, T[]>; // by product handle

function read<T>(key: string): Stored<T> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "{}") as Stored<T>;
  } catch {
    return {};
  }
}

function write<T>(key: string, data: Stored<T>): void {
  window.localStorage.setItem(key, JSON.stringify(data));
}

export function getReviews(handle: string): ReviewEntry[] {
  const local = read<ReviewEntry>(STORAGE_KEYS.reviews)[handle] ?? [];
  const seed = SEED_REVIEWS.filter((r) => r.productHandle === handle);
  return [...local, ...seed];
}

export function addReview(review: ReviewEntry): void {
  const all = read<ReviewEntry>(STORAGE_KEYS.reviews);
  all[review.productHandle] = [review, ...(all[review.productHandle] ?? [])];
  write(STORAGE_KEYS.reviews, all);
}

export function markHelpful(handle: string, id: string): void {
  const key = `${STORAGE_KEYS.reviews}-helpful`;
  const voted = new Set<string>(JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[]);
  if (voted.has(id)) return;
  voted.add(id);
  window.localStorage.setItem(key, JSON.stringify([...voted]));
}

export function hasVotedHelpful(id: string): boolean {
  if (typeof window === "undefined") return false;
  const key = `${STORAGE_KEYS.reviews}-helpful`;
  const voted = new Set<string>(JSON.parse(window.localStorage.getItem(key) ?? "[]") as string[]);
  return voted.has(id);
}

export function summarize(reviews: ReviewEntry[]) {
  const count = reviews.length;
  const buckets = [0, 0, 0, 0, 0]; // index 0 => 1★
  let sum = 0;
  for (const r of reviews) {
    buckets[r.rating - 1] = (buckets[r.rating - 1] ?? 0) + 1;
    sum += r.rating;
  }
  return {
    count,
    average: count ? Math.round((sum / count) * 10) / 10 : 0,
    buckets: buckets
      .map((n, i) => ({ stars: i + 1, count: n, pct: count ? Math.round((n / count) * 100) : 0 }))
      .reverse(),
  };
}

export function getQuestions(handle: string): QuestionEntry[] {
  const local = read<QuestionEntry>(STORAGE_KEYS.questions)[handle] ?? [];
  const seed = SEED_QUESTIONS.filter((q) => q.productHandle === handle);
  return [...local, ...seed];
}

export function addQuestion(entry: QuestionEntry): void {
  const all = read<QuestionEntry>(STORAGE_KEYS.questions);
  all[entry.productHandle] = [entry, ...(all[entry.productHandle] ?? [])];
  write(STORAGE_KEYS.questions, all);
}
