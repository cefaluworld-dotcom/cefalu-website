import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createPriceListsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  logger.info("Seeding Cefalu store data...");

  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    });
    defaultSalesChannel = result;
  }

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        supported_currencies: [{ currency_code: "inr", is_default: true }],
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region (India)...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries: ["in"],
          payment_providers: ["pp_system_default"],
          // Indian MRPs include GST — never add tax on top at checkout.
          is_tax_inclusive: true,
        },
      ],
    },
  });
  const region = regionResult[0];

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "in", provider_id: "tp_system" }],
  });

  logger.info("Seeding stock location...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "Bhiwandi Fulfilment Centre",
          address: {
            city: "Bhiwandi",
            country_code: "IN",
            address_1: "Warehouse address (update before launch)",
            postal_code: "421302",
            province: "Maharashtra",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  });

  logger.info("Seeding fulfillment...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Pan-India Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [{ country_code: "in", type: "country" }],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Delivery (2-5 days)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Delivered in 2-5 business days.",
          code: "standard",
        },
        prices: [
          { currency_code: "inr", amount: 79 },
          { region_id: region.id, amount: 79 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Delivery (1-2 days)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Delivered in 1-2 business days.",
          code: "express",
        },
        prices: [
          { currency_code: "inr", amount: 149 },
          { region_id: region.id, amount: 149 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [defaultSalesChannel[0].id] },
  });

  logger.info("Seeding publishable API key...");
  const { result: publishableApiKeyResult } = await createApiKeysWorkflow(
    container
  ).run({
    input: {
      api_keys: [{ title: "Storefront", type: "publishable", created_by: "" }],
    },
  });
  const publishableApiKey = publishableApiKeyResult[0];

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [defaultSalesChannel[0].id] },
  });

  logger.info("Seeding product categories...");
  const CATEGORIES = [
    { name: "Men's Shirts", handle: "men-shirts" },
    { name: "Men's T-Shirts", handle: "men-t-shirts" },
    { name: "Men's Trousers", handle: "men-trousers" },
    { name: "Men's Kurtas", handle: "men-kurtas" },
    { name: "Men's Blazers", handle: "men-blazers" },
    { name: "Women's Kurtis", handle: "women-kurtis" },
    { name: "Women's Dresses", handle: "women-dresses" },
    { name: "Women's Co-ord Sets", handle: "women-co-ords" },
    { name: "Women's Tops", handle: "women-tops" },
  ] as const;
  const { result: categoryResult } = await createProductCategoriesWorkflow(container).run({
    input: { product_categories: CATEGORIES.map((c) => ({ ...c, is_active: true })) },
  });
  const categoryId = (handle: string) => {
    const hit = categoryResult.find((c) => c.handle === handle);
    if (!hit) throw new Error(`Seed category missing: ${handle}`);
    return hit.id;
  };

  /**
   * Starter catalogue — mirrors constants/catalog-content.ts in the storefront
   * (handles, prices, sizes, colours). `mrp` is the base price; `price` is the
   * live selling price applied through a sale price list, which is what makes
   * Medusa return original_amount > calculated_amount for strike-through MRPs.
   */
  interface SeedProduct {
    title: string;
    subtitle: string;
    handle: string;
    description: string;
    category: string;
    skuPrefix: string;
    mrp: number;
    price: number;
    weight: number;
    sizes: string[];
    colors: Array<{ name: string; hex: string }>;
    metadata: Record<string, unknown>;
  }

  const MEN = ["S", "M", "L", "XL", "XXL"];
  const WOMEN = ["XS", "S", "M", "L", "XL", "XXL"];
  const WAIST = ["28", "30", "32", "34", "36", "38"];
  const C = {
    white: { name: "White", hex: "#FFFFFF" },
    skyBlue: { name: "Sky Blue", hex: "#A9C8EA" },
    navy: { name: "Navy", hex: "#1C2E4A" },
    indigo: { name: "Indigo", hex: "#2E3A87" },
    heatherGrey: { name: "Heather Grey", hex: "#B7BBC0" },
    charcoal: { name: "Charcoal", hex: "#3A3D42" },
    olive: { name: "Olive", hex: "#6B7152" },
    khaki: { name: "Khaki", hex: "#C3AE86" },
    beige: { name: "Beige", hex: "#D8C8A8" },
    black: { name: "Black", hex: "#141414" },
    mustard: { name: "Mustard", hex: "#D4A017" },
    rose: { name: "Rose", hex: "#D9899A" },
    cobaltPrint: { name: "Cobalt Print", hex: "#1F4E9E" },
  };

  const PRODUCTS: SeedProduct[] = [
    {
      title: "Oxford Cotton Shirt", subtitle: "Regular fit · 100% cotton", handle: "oxford-cotton-shirt",
      description: "A crisp everyday Oxford in soft-washed 140 GSM cotton, with a button-down collar and curved hem.",
      category: "men-shirts", skuPrefix: "CF-OXS", mrp: 1799, price: 1299, weight: 280, sizes: MEN,
      colors: [C.white, C.skyBlue, C.navy],
      metadata: { gender: "men", subcategory: "Shirts", fabricFamily: "Cotton", fitFamily: "Regular", sizeChartId: "men-tops", hsnCode: "6205" },
    },
    {
      title: "Everyday Crew T-Shirt", subtitle: "Regular fit · 180 GSM cotton", handle: "everyday-crew-tee",
      description: "A mid-weight combed-cotton crew neck with a rib-knit collar that keeps its shape.",
      category: "men-t-shirts", skuPrefix: "CF-TEE", mrp: 799, price: 599, weight: 200, sizes: MEN,
      colors: [C.white, C.navy, C.heatherGrey, C.olive],
      metadata: { gender: "men", subcategory: "T-Shirts", fabricFamily: "Cotton", fitFamily: "Regular", sizeChartId: "men-tops", hsnCode: "6109" },
    },
    {
      title: "Slim Stretch Chinos", subtitle: "Slim fit · Cotton stretch twill", handle: "slim-stretch-chinos",
      description: "Slim chinos in 98% cotton, 2% elastane twill with a tapered leg and deep front pockets.",
      category: "men-trousers", skuPrefix: "CF-CHN", mrp: 2199, price: 1599, weight: 450, sizes: WAIST,
      colors: [C.khaki, C.navy, C.charcoal],
      metadata: { gender: "men", subcategory: "Trousers", fabricFamily: "Cotton stretch", fitFamily: "Slim", sizeChartId: "men-bottoms", hsnCode: "6203" },
    },
    {
      title: "Linen-Blend Kurta", subtitle: "Straight fit · Knee length", handle: "linen-blend-kurta",
      description: "A breathable linen-cotton kurta with a mandarin collar, concealed placket and side slits.",
      category: "men-kurtas", skuPrefix: "CF-KRT", mrp: 2499, price: 1899, weight: 350, sizes: MEN,
      colors: [C.white, C.indigo, C.beige],
      metadata: { gender: "men", subcategory: "Kurtas", fabricFamily: "Linen blend", fitFamily: "Straight", sizeChartId: "men-kurtas", hsnCode: "6211" },
    },
    {
      title: "Unstructured Linen Blazer", subtitle: "Tailored fit · 100% linen", handle: "linen-blazer",
      description: "An unlined, unstructured linen blazer with notch lapels, patch pockets and a single back vent.",
      category: "men-blazers", skuPrefix: "CF-BLZ", mrp: 5999, price: 4499, weight: 650, sizes: MEN,
      colors: [C.navy, C.beige],
      metadata: { gender: "men", subcategory: "Blazers", fabricFamily: "Linen", fitFamily: "Tailored", sizeChartId: "men-tops", hsnCode: "6203" },
    },
    {
      title: "Printed Cotton Kurti", subtitle: "A-line · Calf length", handle: "printed-cotton-kurti",
      description: "A block-print-inspired cotton cambric kurti with three-quarter sleeves and a keyhole neck.",
      category: "women-kurtis", skuPrefix: "CF-KTI", mrp: 1699, price: 1199, weight: 260, sizes: WOMEN,
      colors: [C.cobaltPrint, C.mustard, C.rose],
      metadata: { gender: "women", subcategory: "Kurtis", fabricFamily: "Cotton", fitFamily: "A-Line", sizeChartId: "women-tops", hsnCode: "6211" },
    },
    {
      title: "Tiered Midi Dress", subtitle: "Flared · Cotton voile", handle: "tiered-midi-dress",
      description: "A three-tier cotton voile midi with a lined bodice, square neck and adjustable waist tie.",
      category: "women-dresses", skuPrefix: "CF-DRS", mrp: 2499, price: 1799, weight: 320, sizes: WOMEN,
      colors: [C.cobaltPrint, C.white, C.black],
      metadata: { gender: "women", subcategory: "Dresses", fabricFamily: "Cotton", fitFamily: "Flared", sizeChartId: "women-tops", hsnCode: "6204" },
    },
    {
      title: "Rayon Co-ord Set", subtitle: "Relaxed · Shirt + palazzo", handle: "rayon-coord-set",
      description: "A relaxed rayon shirt and drawstring palazzo set — wear together or separately.",
      category: "women-co-ords", skuPrefix: "CF-CRD", mrp: 2999, price: 2199, weight: 420, sizes: WOMEN,
      colors: [C.skyBlue, C.olive, C.beige],
      metadata: { gender: "women", subcategory: "Co-ord Sets", fabricFamily: "Rayon", fitFamily: "Relaxed", sizeChartId: "women-tops", hsnCode: "6204" },
    },
  ];

  const code = (v: string) => v.toUpperCase().replace(/[^A-Z0-9]+/g, "");
  const skuFor = (p: SeedProduct, color: string, size: string) => `${p.skuPrefix}-${code(color)}-${code(size)}`;

  /**
   * Realistic starter stock: the largest size runs low and one colour/size is
   * sold out per product, so storefront low-stock and sold-out states are exercised.
   */
  const stockBySku = new Map<string, number>();
  for (const p of PRODUCTS) {
    p.colors.forEach((c, ci) =>
      p.sizes.forEach((size, si) => {
        const last = si === p.sizes.length - 1;
        const soldOut = ci === p.colors.length - 1 && si === 0;
        stockBySku.set(skuFor(p, c.name, size), soldOut ? 0 : last ? 3 : 25);
      })
    );
  }

  logger.info("Seeding products (Size × Colour variants)...");
  await createProductsWorkflow(container).run({
    input: {
      products: PRODUCTS.map((p) => ({
        title: p.title,
        subtitle: p.subtitle,
        handle: p.handle,
        description: p.description,
        status: ProductStatus.PUBLISHED,
        category_ids: [categoryId(p.category)],
        shipping_profile_id: shippingProfile.id,
        weight: p.weight,
        metadata: { ...p.metadata, colors: p.colors, sizes: p.sizes },
        options: [
          { title: "Size", values: p.sizes },
          { title: "Color", values: p.colors.map((c) => c.name) },
        ],
        variants: p.colors.flatMap((c) =>
          p.sizes.map((size) => ({
            title: `${size} / ${c.name}`,
            sku: skuFor(p, c.name, size),
            manage_inventory: true,
            options: { Size: size, Color: c.name },
            prices: [{ amount: p.mrp, currency_code: "inr" }],
          }))
        ),
        sales_channels: [{ id: defaultSalesChannel[0].id }],
      })),
    },
  });

  logger.info("Seeding launch sale price list...");
  const { data: seededVariants } = await query.graph({
    entity: "product_variant",
    fields: ["id", "sku"],
  });
  const salePriceBySku = new Map<string, number>();
  for (const p of PRODUCTS) {
    p.colors.forEach((c) => p.sizes.forEach((size) => salePriceBySku.set(skuFor(p, c.name, size), p.price)));
  }
  await createPriceListsWorkflow(container).run({
    input: {
      price_lists_data: [
        {
          title: "Launch prices",
          description: "Selling prices below MRP for the launch collection.",
          status: "active",
          prices: (seededVariants as Array<{ id: string; sku: string | null }>)
            .filter((v) => v.sku && salePriceBySku.has(v.sku))
            .map((v) => ({ variant_id: v.id, amount: salePriceBySku.get(v.sku as string) as number, currency_code: "inr" })),
        },
      ],
    },
  });

  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = (inventoryItems as Array<{ id: string; sku: string | null }>).map(
    (item) => ({
      location_id: stockLocation.id,
      stocked_quantity: item.sku ? stockBySku.get(item.sku) ?? 25 : 25,
      inventory_item_id: item.id,
    })
  );

  await createInventoryLevelsWorkflow(container).run({
    input: { inventory_levels: inventoryLevels },
  });

  logger.info("Seed complete.");
  logger.info(
    `Publishable key (set as NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY): ${publishableApiKey.token}`
  );
}
