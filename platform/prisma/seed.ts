/**
 * Platform seed: roles/permissions matrix, core coupons, doctors, warehouse
 * mirror and a demo moderator. Run: pnpm --filter @cefalu/platform seed
 */
import { PrismaClient, RoleName } from "@prisma/client";

const prisma = new PrismaClient();

const PERMISSIONS = [
  ["orders:read", "View orders"],
  ["orders:refund", "Initiate refunds"],
  ["reviews:moderate", "Approve or hide reviews"],
  ["coupons:manage", "Create and edit coupons"],
  ["inventory:adjust", "Adjust stock levels"],
  ["reports:read", "View analytics & reports"],
  ["customers:read", "View customer profiles"],
] as const;

const ROLE_GRANTS: Record<RoleName, ReadonlyArray<(typeof PERMISSIONS)[number][0]>> = {
  ADMIN: PERMISSIONS.map((p) => p[0]),
  MODERATOR: ["reviews:moderate", "orders:read", "customers:read"],
  CUSTOMER: [],
};

async function main() {
  // Permissions
  for (const [key, label] of PERMISSIONS) {
    await prisma.permission.upsert({ where: { key }, update: { label }, create: { key, label } });
  }

  // Roles + grants
  for (const name of Object.values(RoleName)) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name.toLowerCase()} role` },
    });
    for (const key of ROLE_GRANTS[name]) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: permission.id } },
        update: {},
        create: { roleId: role.id, permissionId: permission.id },
      });
    }
  }

  // Coupons (mirror of storefront config; DB becomes source of truth when wired)
  const coupons = [
    { code: "WELCOME10", label: "10% off your first order", percentOff: 10, minSubtotal: 0 },
    { code: "CEFALU15", label: "15% off sitewide", percentOff: 15, minSubtotal: 999 },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: c, create: c });
  }

  // Doctors
  const doctors = [
    { name: "Dr. Kavita Rao", credentials: "MD, Internal Medicine", role: "Chief Scientific Advisor", quote: "Doses match the evidence, every time.", sortOrder: 1 },
    { name: "Dr. Arjun Nair", credentials: "PhD, Clinical Nutrition", role: "Formulation Lead", quote: "We formulate for Indian realities.", sortOrder: 2 },
    { name: "Dr. Meera Iyer", credentials: "MBBS, DNB (Endocrinology)", role: "Medical Reviewer", quote: "Batch-level lab reports make Cefalu verifiable.", sortOrder: 3 },
  ];
  for (const d of doctors) {
    const existing = await prisma.doctor.findFirst({ where: { name: d.name } });
    if (!existing) await prisma.doctor.create({ data: d });
  }

  // Warehouse mirror (Bhiwandi FC from the Medusa seed)
  await prisma.warehouse.upsert({
    where: { medusaStockLocationId: "seed-bhiwandi" },
    update: {},
    create: {
      medusaStockLocationId: "seed-bhiwandi",
      name: "Bhiwandi Fulfilment Centre",
      city: "Bhiwandi",
      state: "Maharashtra",
      pincode: "421302",
    },
  });

  console.log("Platform seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
