# Deployment

For the selected Vercel storefront and Railway Medusa hosting, follow [Vercel + Railway](VercelRailway.md). The AWS plan below is retained as an alternative architecture; its deployment workflows described later in this document are proposals and are not present in this repository.

Two supported targets: **AWS ECS Fargate** (recommended for the container) and **Vercel** (preview + optional production). The Medusa backend and Postgres run separately (ECS service + RDS, or a managed Medusa host).

## Build artifact

`output: "standalone"` produces a self-contained `.next/standalone` server. The multi-stage `Dockerfile` builds it, runs as non-root `nextjs`, and boots via `node scripts/check-env.mjs && node server.js` with a `/api/health` healthcheck.

```bash
docker build -t cefalu-web .
docker run -p 3000:3000 --env-file .env.production cefalu-web
```

## AWS topology

```
Route53 ─► CloudFront ─► ALB ─► ECS Fargate service (web, 2+ tasks, autoscaled)
                                   │
             RDS PostgreSQL ◄──────┤ (Medusa + platform DBs)
             ElastiCache Redis ◄───┤ (Medusa cache/events)
             S3 + CloudFront ◄─────┘ (media, presigned uploads)
Secrets Manager ─► task env    CloudWatch ◄─ logs/metrics
```

### Provisioning checklist
1. **ECR** — create repo `cefalu-web`; CI pushes `:$SHA` on tag.
2. **RDS PostgreSQL 16** — Multi-AZ, private subnets, automated backups (7–35 days), parameter group with `rds.force_ssl=1`. Create `medusa` and `cefalu_platform` databases.
3. **ElastiCache Redis** — for Medusa cache/event bus.
4. **S3** — media bucket (block public access; serve via CloudFront OAC). Bucket policy limited to the CloudFront distribution; app uses presigned PUTs.
5. **CloudFront** — one distribution for the app (ALB origin) and one for S3 media; attach ACM cert (us-east-1 for CloudFront).
6. **ALB** — HTTPS listener (ACM cert in region), target group health check `GET /api/health` (200).
7. **ECS Fargate** — service with 2+ tasks, rolling deploy, `minimumHealthyPercent=100`, `maximumPercent=200`. Task role scoped to S3 + Secrets Manager; execution role for ECR pull + CloudWatch logs.
8. **Auto Scaling** — target tracking on CPU 60% and ALB `RequestCountPerTarget`.
9. **Secrets Manager** — inject `AUTH_SECRET`, gateway keys, DB URLs as task secrets (never plaintext env).
10. **Route53** — alias `cefalu.in` → CloudFront; `api.cefalu.in` → Medusa ALB.
11. **Cloudflare** (optional, in front of Route53) — WAF, bot management, DNS. Set SSL mode to Full (strict).

### CI/CD
- `.github/workflows/ci.yml` — lint, typecheck, unit tests (+coverage), production build, Playwright E2E on every PR/push.
- `.github/workflows/deploy-production.yml` — on `v*` tag: OIDC assume role → build/push to ECR → render task def with new image → `ecs deploy` waiting for stability.
- `.github/workflows/deploy-preview.yml` — Vercel preview per PR with a URL comment (gated by `VERCEL_ENABLED`).

Required GitHub secrets: `AWS_DEPLOY_ROLE_ARN` (OIDC), and for previews `VERCEL_TOKEN`. Repo **variables**: `NEXT_PUBLIC_*` build args.

## Database migrations
- Platform: `pnpm --filter @cefalu/platform migrate` (runs `prisma migrate deploy`) as a one-off ECS task or release step.
- Medusa: `pnpm --filter medusa exec medusa db:migrate` before rolling the backend.

## Rollback
ECS keeps prior task-definition revisions — roll back by updating the service to the previous revision (`aws ecs update-service --task-definition <family>:<n>`). CloudFront caches static assets immutably (hashed filenames), so rollbacks don't require cache invalidation for app JS/CSS. See `docs/Troubleshooting.md` → Rollback.
