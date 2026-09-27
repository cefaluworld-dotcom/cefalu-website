import { defineConfig, loadEnv, Modules } from "@medusajs/framework/utils";

loadEnv(process.env.NODE_ENV || "development", process.cwd());

export default defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    redisUrl: process.env.REDIS_URL,
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:9000",
      authCors: process.env.AUTH_CORS || "http://localhost:3000,http://localhost:9000",
      jwtSecret: process.env.JWT_SECRET || "supersecret-change-me",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret-change-me",
    },
  },
  admin: {
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000",
  },
  modules: [
    { resolve: "./src/modules/review" },
    { resolve: "./src/modules/wishlist" },
    {
      resolve: "@medusajs/medusa/file",
      options: {
        providers: [
          ...(process.env.S3_BUCKET
            ? [
                {
                  resolve: "@medusajs/medusa/file-s3",
                  id: "s3",
                  options: {
                    file_url: process.env.S3_FILE_URL,
                    access_key_id: process.env.S3_ACCESS_KEY_ID,
                    secret_access_key: process.env.S3_SECRET_ACCESS_KEY,
                    region: process.env.S3_REGION,
                    bucket: process.env.S3_BUCKET,
                    endpoint: process.env.S3_ENDPOINT,
                  },
                },
              ]
            : [
                {
                  resolve: "@medusajs/medusa/file-local",
                  id: "local",
                  options: {
                    upload_dir: "static",
                    backend_url: `${process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"}/static`,
                  },
                },
              ]),
        ],
      },
    },
    ...(process.env.REDIS_URL
      ? [
          { resolve: "@medusajs/medusa/cache-redis", key: Modules.CACHE, options: { redisUrl: process.env.REDIS_URL } },
          { resolve: "@medusajs/medusa/event-bus-redis", key: Modules.EVENT_BUS, options: { redisUrl: process.env.REDIS_URL } },
          {
            resolve: "@medusajs/medusa/workflow-engine-redis",
            key: Modules.WORKFLOW_ENGINE,
            options: { redis: { url: process.env.REDIS_URL } },
          },
        ]
      : []),
  ],
});
