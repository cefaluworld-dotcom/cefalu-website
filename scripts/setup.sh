#!/usr/bin/env bash
# One-shot local setup for Nutrosil Wellness.
set -euo pipefail

echo "▶ Enabling pnpm via corepack…"
corepack enable >/dev/null 2>&1 || true

echo "▶ Installing dependencies…"
pnpm install

if [ ! -f .env.local ]; then
  cp .env.example .env.local
  echo "▶ Created .env.local — fill in service keys as needed."
fi

if [ ! -f medusa/.env ]; then
  cp medusa/.env.example medusa/.env
  echo "▶ Created medusa/.env — set DATABASE_URL before running the backend."
fi

echo "✔ Setup complete. Next steps:"
echo "   pnpm dev            # storefront on :3000"
echo "   pnpm medusa:dev     # commerce backend on :9000 (needs Postgres)"
echo "   pnpm medusa:seed    # demo catalog + publishable key"
