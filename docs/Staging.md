# Isolated staging stack

This stack uses PostgreSQL, Redis, Medusa and the Next storefront. It binds the web and Medusa ports to localhost and does not affect cefalu.in. It is a staging starting point, not a production deployment.

1. Copy `.env.staging.example` to `.env.staging`. Replace the sample DB and application secrets. Keep `.env.staging` out of Git.
2. Run `docker compose --env-file .env.staging -f docker-compose.staging.yml up --build -d` on a Docker host. The first database initialization creates `medusa` and `cefalu_platform`; changing the SQL later does not re-run it on an existing volume.
3. Check `docker compose --env-file .env.staging -f docker-compose.staging.yml ps` and visit `http://localhost:3000/api/health` and `http://localhost:9000/health`. Inspect `docker compose --env-file .env.staging -f docker-compose.staging.yml logs medusa-migrate medusa web` if any service fails.
4. Create a Medusa publishable key linked to the store's sales channel. Put its token in `.env.staging` as `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`, then rebuild the web image. Next.js embeds public values at build time. Import or create staging-only products; the repository's demo seed is not the live Cefalu catalog and should not be run against production.
5. Test browse, cart, COD and sandbox payment flows with staging credentials and sample orders. Verify totals, webhooks, emails and order records. Do not use live gateway keys or customer data here.

The storefront uses `MEDUSA_INTERNAL_URL=http://medusa:9000` for server-side requests and `NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000` for the browser. For remote staging, replace both public URLs, set Medusa CORS to the actual HTTPS staging origin, and provide a reverse proxy/TLS endpoint. Medusa Admin cookie login on localhost in production mode may need a proper staging domain. Platform Prisma migration and Uniware integration remain separate gates.

Stop with `docker compose --env-file .env.staging -f docker-compose.staging.yml down`. Preserve the named database volume unless the staging data is intentionally discarded.
