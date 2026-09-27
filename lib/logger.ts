type Level = "debug" | "info" | "warn" | "error";

const LEVEL_ORDER: Record<Level, number> = { debug: 10, info: 20, warn: 30, error: 40 };
const MIN_LEVEL: Level = (process.env.LOG_LEVEL as Level) || (process.env.NODE_ENV === "production" ? "info" : "debug");

function emit(level: Level, message: string, meta?: Record<string, unknown>) {
  if (LEVEL_ORDER[level] < LEVEL_ORDER[MIN_LEVEL]) return;
  const entry = { level, time: new Date().toISOString(), message, ...meta };
  const line = JSON.stringify(entry);
  if (level === "error") console.error(line);
  else console.warn(line);
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => emit("debug", message, meta),
  info: (message: string, meta?: Record<string, unknown>) => emit("info", message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => emit("warn", message, meta),
  error: (message: string, meta?: Record<string, unknown>) => emit("error", message, meta),
};

/** Structured request log (called by withApi). */
export function logRequest(meta: {
  method: string; path: string; status: number; durationMs: number; ip?: string; userId?: string;
}) {
  emit(meta.status >= 500 ? "error" : "info", "request", meta);
}

/** Audit log for sensitive/administrative actions. */
export function audit(action: string, meta: Record<string, unknown>) {
  emit("info", "audit", { action, ...meta });
}

/** Activity log for notable user events (order placed, review posted…). */
export function activity(event: string, meta: Record<string, unknown>) {
  emit("info", "activity", { event, ...meta });
}
