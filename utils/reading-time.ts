/** Estimated minutes to read, floored at 1 (200 wpm). */
export function readingTimeMinutes(words: number | null | undefined): number {
  return Math.max(1, Math.ceil((words ?? 0) / 200));
}
