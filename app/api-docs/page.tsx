import type { Metadata } from "next";
import { constructMetadata } from "@/lib/seo";
import { openApiSpec, type OpenApiOperation } from "@/lib/openapi";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const metadata: Metadata = constructMetadata({
  title: "API Documentation",
  description: "REST reference for the Cefalu storefront, checkout, payments and admin APIs.",
  pathname: "/api-docs",
  noIndex: true,
});

const METHOD_STYLES: Record<string, string> = {
  get: "bg-secondary text-primary",
  post: "bg-gold-100 text-gold-700",
  patch: "bg-brand-100 text-brand-700",
  delete: "bg-destructive/10 text-destructive",
};

/** CSP-safe Swagger-style reference rendered from the typed spec (no external scripts). */
export default function ApiDocsPage() {
  const groups = new Map<string, Array<{ path: string; method: string; op: OpenApiOperation }>>();
  for (const [path, methods] of Object.entries(openApiSpec.paths)) {
    for (const [method, op] of Object.entries(methods)) {
      const tag = op.tags[0] ?? "Other";
      const list = groups.get(tag) ?? [];
      list.push({ path, method, op });
      groups.set(tag, list);
    }
  }

  return (
    <Container size="lg" className="py-12 md:py-16">
      <p className="text-overline text-primary">REST reference</p>
      <h1 className="mt-2 text-display-md">{openApiSpec.info.title}</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">{openApiSpec.info.description}</p>
      <p className="mt-2 text-sm text-muted-foreground">
        Machine-readable spec:{" "}
        <a href="/api/openapi" className="link-underline font-semibold text-primary">
          /api/openapi
        </a>{" "}
        · OpenAPI {openApiSpec.openapi} · v{openApiSpec.info.version}
      </p>

      <div className="mt-10 space-y-10">
        {openApiSpec.tags.map((tag) => {
          const endpoints = groups.get(tag.name) ?? [];
          if (endpoints.length === 0) return null;
          return (
            <section key={tag.name} aria-labelledby={`tag-${tag.name}`}>
              <h2 id={`tag-${tag.name}`} className="font-display text-2xl font-bold">
                {tag.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">{tag.description}</p>
              <ul className="mt-4 space-y-3">
                {endpoints.map(({ path, method, op }) => (
                  <li key={`${method}-${path}`} className="rounded-2xl border bg-card p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span
                        className={cn(
                          "w-16 rounded-full px-2 py-1 text-center text-2xs font-black uppercase",
                          METHOD_STYLES[method] ?? "bg-muted"
                        )}
                      >
                        {method}
                      </span>
                      <code className="font-mono text-sm font-semibold">{path}</code>
                      {op.security && <Badge variant="outline">session</Badge>}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{op.summary}</p>

                    {op.parameters && op.parameters.length > 0 && (
                      <dl className="mt-3 space-y-1">
                        {op.parameters.map((p) => (
                          <div key={p.name} className="flex flex-wrap gap-2 text-xs">
                            <dt className="font-mono font-semibold">
                              {p.name}
                              <span className="text-muted-foreground"> ({p.in})</span>
                              {p.required && <span className="text-destructive">*</span>}
                            </dt>
                            <dd className="text-muted-foreground">
                              {p.schema.type}
                              {p.schema.enum ? `: ${p.schema.enum.join(" | ")}` : ""}
                              {p.description ? ` — ${p.description}` : ""}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}

                    {op.requestBody && (
                      <pre className="mt-3 overflow-x-auto rounded-xl bg-surface p-3 font-mono text-xs">
                        {JSON.stringify(op.requestBody.example, null, 2)}
                      </pre>
                    )}

                    <p className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(op.responses).map(([code, r]) => (
                        <span key={code} className="rounded-full bg-surface px-2.5 py-1 text-2xs font-semibold">
                          {code} · {r.description}
                        </span>
                      ))}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
