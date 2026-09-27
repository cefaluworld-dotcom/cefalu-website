import { List } from "lucide-react";

export interface TocEntry {
  id: string;
  text: string;
}

/** In-page anchors built from the article's H2 blocks. */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  if (entries.length < 2) return null;

  return (
    <nav aria-label="Table of contents" className="rounded-2xl border bg-surface p-5">
      <p className="flex items-center gap-2 text-sm font-bold">
        <List className="size-4 text-primary" aria-hidden="true" />
        In this article
      </p>
      <ol className="mt-3 space-y-2">
        {entries.map((entry, i) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              className="link-underline flex gap-2 text-sm text-muted-foreground hover:text-primary"
            >
              <span className="font-mono text-2xs text-brand-300">{String(i + 1).padStart(2, "0")}</span>
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
