-- 0001_init · Cefalu platform schema (PostgreSQL)

-- Enums
CREATE TYPE "RoleName" AS ENUM ('ADMIN','MODERATOR','CUSTOMER');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING','PAID','FULFILLED','DELIVERED','CANCELLED','REFUNDED');
CREATE TYPE "PaymentStatus" AS ENUM ('CREATED','AUTHORIZED','CAPTURED','FAILED','REFUNDED');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE','PAUSED','CANCELLED');
CREATE TYPE "MovementType" AS ENUM ('INBOUND','OUTBOUND','ADJUSTMENT','RETURN');
CREATE TYPE "TicketStatus" AS ENUM ('OPEN','PENDING','RESOLVED','CLOSED');

-- Identity
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "medusaCustomerId" TEXT UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "name" TEXT,
  "phone" TEXT,
  "passwordHash" TEXT,
  "emailVerifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "deletedAt" TIMESTAMP(3)
);
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");

CREATE TABLE "Role" (
  "id" TEXT PRIMARY KEY,
  "name" "RoleName" NOT NULL UNIQUE,
  "description" TEXT
);

CREATE TABLE "Permission" (
  "id" TEXT PRIMARY KEY,
  "key" TEXT NOT NULL UNIQUE,
  "label" TEXT NOT NULL
);

CREATE TABLE "UserRole" (
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "roleId" TEXT NOT NULL REFERENCES "Role"("id") ON DELETE CASCADE,
  PRIMARY KEY ("userId","roleId")
);

CREATE TABLE "RolePermission" (
  "roleId" TEXT NOT NULL REFERENCES "Role"("id") ON DELETE CASCADE,
  "permissionId" TEXT NOT NULL REFERENCES "Permission"("id") ON DELETE CASCADE,
  PRIMARY KEY ("roleId","permissionId")
);

CREATE TABLE "Address" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "label" TEXT NOT NULL DEFAULT 'Home',
  "firstName" TEXT NOT NULL,
  "lastName" TEXT NOT NULL,
  "line1" TEXT NOT NULL,
  "line2" TEXT,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" VARCHAR(6) NOT NULL,
  "phone" VARCHAR(10) NOT NULL,
  "isDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Address_userId_idx" ON "Address"("userId");

-- Catalog & content
CREATE TABLE "Brand" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "logoUrl" TEXT
);

CREATE TABLE "Category" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE,
  "parentId" TEXT REFERENCES "Category"("id") ON DELETE SET NULL
);
CREATE INDEX "Category_parentId_idx" ON "Category"("parentId");

CREATE TABLE "Collection" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL UNIQUE
);

CREATE TABLE "Product" (
  "id" TEXT PRIMARY KEY,
  "medusaProductId" TEXT UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "name" TEXT NOT NULL,
  "shortDescription" TEXT NOT NULL,
  "longDescription" TEXT NOT NULL,
  "brandId" TEXT REFERENCES "Brand"("id") ON DELETE SET NULL,
  "categoryId" TEXT REFERENCES "Category"("id") ON DELETE SET NULL,
  "subcategory" TEXT,
  "benefits" TEXT[] NOT NULL DEFAULT '{}',
  "features" TEXT[] NOT NULL DEFAULT '{}',
  "directions" TEXT NOT NULL,
  "warnings" TEXT[] NOT NULL DEFAULT '{}',
  "storage" TEXT NOT NULL,
  "tags" TEXT[] NOT NULL DEFAULT '{}',
  "images" TEXT[] NOT NULL DEFAULT '{}',
  "videos" TEXT[] NOT NULL DEFAULT '{}',
  "mrp" INTEGER NOT NULL,
  "offerPrice" INTEGER NOT NULL,
  "subscriptionPct" INTEGER NOT NULL DEFAULT 15,
  "sku" TEXT UNIQUE,
  "rating" DECIMAL(2,1) NOT NULL DEFAULT 0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "Product_categoryId_isActive_idx" ON "Product"("categoryId","isActive");
CREATE INDEX "Product_brandId_idx" ON "Product"("brandId");

CREATE TABLE "ProductCollection" (
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "collectionId" TEXT NOT NULL REFERENCES "Collection"("id") ON DELETE CASCADE,
  PRIMARY KEY ("productId","collectionId")
);

CREATE TABLE "Ingredient" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "form" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "benefits" TEXT[] NOT NULL DEFAULT '{}',
  "research" TEXT NOT NULL,
  "source" TEXT NOT NULL
);

CREATE TABLE "ProductIngredient" (
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "ingredientId" TEXT NOT NULL REFERENCES "Ingredient"("id") ON DELETE CASCADE,
  "amount" TEXT NOT NULL,
  "purpose" TEXT NOT NULL,
  PRIMARY KEY ("productId","ingredientId")
);

CREATE TABLE "NutritionRow" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "nutrient" TEXT NOT NULL,
  "perServing" TEXT NOT NULL,
  "rda" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX "NutritionRow_productId_sortOrder_idx" ON "NutritionRow"("productId","sortOrder");

CREATE TABLE "ClinicalStudy" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT REFERENCES "Product"("id") ON DELETE SET NULL,
  "title" TEXT NOT NULL,
  "journal" TEXT NOT NULL,
  "year" INTEGER NOT NULL,
  "finding" TEXT NOT NULL,
  "doi" TEXT
);
CREATE INDEX "ClinicalStudy_productId_idx" ON "ClinicalStudy"("productId");

CREATE TABLE "ResearchPaper" (
  "id" TEXT PRIMARY KEY,
  "studyId" TEXT REFERENCES "ClinicalStudy"("id") ON DELETE SET NULL,
  "title" TEXT NOT NULL,
  "url" TEXT NOT NULL,
  "authors" TEXT,
  "abstract" TEXT
);

CREATE TABLE "Faq" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT REFERENCES "Product"("id") ON DELETE CASCADE,
  "category" TEXT NOT NULL DEFAULT 'general',
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX "Faq_productId_idx" ON "Faq"("productId");
CREATE INDEX "Faq_category_sortOrder_idx" ON "Faq"("category","sortOrder");

CREATE TABLE "Blog" (
  "id" TEXT PRIMARY KEY,
  "sanityId" TEXT UNIQUE,
  "slug" TEXT NOT NULL UNIQUE,
  "title" TEXT NOT NULL,
  "excerpt" TEXT,
  "authorName" TEXT,
  "publishedAt" TIMESTAMP(3),
  "tags" TEXT[] NOT NULL DEFAULT '{}'
);
CREATE INDEX "Blog_publishedAt_idx" ON "Blog"("publishedAt");

CREATE TABLE "Doctor" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "credentials" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "quote" TEXT NOT NULL,
  "imageUrl" TEXT,
  "sortOrder" INTEGER NOT NULL DEFAULT 0
);

-- Community
CREATE TABLE "Review" (
  "id" TEXT PRIMARY KEY,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "author" TEXT NOT NULL,
  "rating" SMALLINT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "verified" BOOLEAN NOT NULL DEFAULT false,
  "approved" BOOLEAN NOT NULL DEFAULT true,
  "helpful" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_rating_check" CHECK ("rating" BETWEEN 1 AND 5)
);
CREATE INDEX "Review_productId_approved_createdAt_idx" ON "Review"("productId","approved","createdAt");
CREATE INDEX "Review_userId_idx" ON "Review"("userId");

CREATE TABLE "ReviewImage" (
  "id" TEXT PRIMARY KEY,
  "reviewId" TEXT NOT NULL REFERENCES "Review"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL
);

CREATE TABLE "ReviewVideo" (
  "id" TEXT PRIMARY KEY,
  "reviewId" TEXT NOT NULL REFERENCES "Review"("id") ON DELETE CASCADE,
  "url" TEXT NOT NULL
);

CREATE TABLE "WishlistItem" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "productId" TEXT NOT NULL REFERENCES "Product"("id") ON DELETE CASCADE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WishlistItem_userId_productId_key" UNIQUE ("userId","productId")
);

-- Commerce mirrors
CREATE TABLE "Cart" (
  "id" TEXT PRIMARY KEY,
  "medusaCartId" TEXT NOT NULL UNIQUE,
  "email" TEXT,
  "userId" TEXT,
  "couponCode" TEXT,
  "abandonedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Cart_email_abandonedAt_idx" ON "Cart"("email","abandonedAt");

CREATE TABLE "CartItem" (
  "id" TEXT PRIMARY KEY,
  "cartId" TEXT NOT NULL REFERENCES "Cart"("id") ON DELETE CASCADE,
  "variantId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL
);
CREATE INDEX "CartItem_cartId_idx" ON "CartItem"("cartId");

CREATE TABLE "Order" (
  "id" TEXT PRIMARY KEY,
  "medusaOrderId" TEXT NOT NULL UNIQUE,
  "displayId" INTEGER NOT NULL,
  "email" TEXT NOT NULL,
  "userId" TEXT,
  "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "subtotal" INTEGER NOT NULL,
  "discount" INTEGER NOT NULL DEFAULT 0,
  "shipping" INTEGER NOT NULL DEFAULT 0,
  "codFee" INTEGER NOT NULL DEFAULT 0,
  "gstIncluded" INTEGER NOT NULL DEFAULT 0,
  "total" INTEGER NOT NULL,
  "couponCode" TEXT,
  "paymentMethod" TEXT NOT NULL,
  "placedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "invoiceNumber" TEXT UNIQUE
);
CREATE INDEX "Order_email_placedAt_idx" ON "Order"("email","placedAt");
CREATE INDEX "Order_status_idx" ON "Order"("status");

CREATE TABLE "OrderItem" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "variantId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "quantity" INTEGER NOT NULL
);
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

CREATE TABLE "Payment" (
  "id" TEXT PRIMARY KEY,
  "orderId" TEXT NOT NULL REFERENCES "Order"("id") ON DELETE CASCADE,
  "gateway" TEXT NOT NULL,
  "gatewayRef" TEXT NOT NULL UNIQUE,
  "amount" INTEGER NOT NULL,
  "status" "PaymentStatus" NOT NULL DEFAULT 'CREATED',
  "method" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Payment_orderId_idx" ON "Payment"("orderId");

CREATE TABLE "Transaction" (
  "id" TEXT PRIMARY KEY,
  "paymentId" TEXT NOT NULL REFERENCES "Payment"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "raw" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Transaction_paymentId_createdAt_idx" ON "Transaction"("paymentId","createdAt");

-- Promotions
CREATE TABLE "Coupon" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "label" TEXT NOT NULL,
  "percentOff" INTEGER NOT NULL,
  "maxDiscount" INTEGER,
  "minSubtotal" INTEGER NOT NULL DEFAULT 0,
  "usageLimit" INTEGER,
  "usedCount" INTEGER NOT NULL DEFAULT 0,
  "startsAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true
);
CREATE INDEX "Coupon_isActive_expiresAt_idx" ON "Coupon"("isActive","expiresAt");

CREATE TABLE "GiftCard" (
  "id" TEXT PRIMARY KEY,
  "code" TEXT NOT NULL UNIQUE,
  "balance" INTEGER NOT NULL,
  "initial" INTEGER NOT NULL,
  "issuedTo" TEXT,
  "expiresAt" TIMESTAMP(3),
  "isActive" BOOLEAN NOT NULL DEFAULT true
);

-- Subscriptions
CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "variantId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "unitPrice" INTEGER NOT NULL,
  "discountPct" INTEGER NOT NULL DEFAULT 15,
  "intervalDays" INTEGER NOT NULL DEFAULT 30,
  "nextDeliveryAt" TIMESTAMP(3) NOT NULL,
  "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "cancelledAt" TIMESTAMP(3)
);
CREATE INDEX "Subscription_userId_status_idx" ON "Subscription"("userId","status");
CREATE INDEX "Subscription_status_nextDeliveryAt_idx" ON "Subscription"("status","nextDeliveryAt");

-- Inventory mirrors
CREATE TABLE "Warehouse" (
  "id" TEXT PRIMARY KEY,
  "medusaStockLocationId" TEXT UNIQUE,
  "name" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "pincode" TEXT NOT NULL
);

CREATE TABLE "Inventory" (
  "id" TEXT PRIMARY KEY,
  "warehouseId" TEXT NOT NULL REFERENCES "Warehouse"("id") ON DELETE CASCADE,
  "medusaInventoryItemId" TEXT NOT NULL,
  "sku" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Inventory_warehouse_item_key" UNIQUE ("warehouseId","medusaInventoryItemId")
);
CREATE INDEX "Inventory_sku_idx" ON "Inventory"("sku");

CREATE TABLE "StockMovement" (
  "id" TEXT PRIMARY KEY,
  "warehouseId" TEXT NOT NULL REFERENCES "Warehouse"("id") ON DELETE CASCADE,
  "sku" TEXT NOT NULL,
  "type" "MovementType" NOT NULL,
  "quantity" INTEGER NOT NULL,
  "reference" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "StockMovement_warehouseId_createdAt_idx" ON "StockMovement"("warehouseId","createdAt");
CREATE INDEX "StockMovement_sku_idx" ON "StockMovement"("sku");

-- Comms & support
CREATE TABLE "Notification" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "channel" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "readAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "Notification_userId_readAt_idx" ON "Notification"("userId","readAt");

CREATE TABLE "NewsletterSubscriber" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT NOT NULL UNIQUE,
  "source" TEXT NOT NULL DEFAULT 'footer',
  "subscribedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "unsubscribedAt" TIMESTAMP(3)
);

CREATE TABLE "ContactMessage" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "handledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ContactMessage_createdAt_idx" ON "ContactMessage"("createdAt");

CREATE TABLE "SupportTicket" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "email" TEXT NOT NULL,
  "subject" TEXT NOT NULL,
  "status" "TicketStatus" NOT NULL DEFAULT 'OPEN',
  "priority" SMALLINT NOT NULL DEFAULT 2,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "SupportTicket_status_priority_updatedAt_idx" ON "SupportTicket"("status","priority","updatedAt");

CREATE TABLE "TicketMessage" (
  "id" TEXT PRIMARY KEY,
  "ticketId" TEXT NOT NULL REFERENCES "SupportTicket"("id") ON DELETE CASCADE,
  "fromStaff" BOOLEAN NOT NULL DEFAULT false,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "TicketMessage_ticketId_createdAt_idx" ON "TicketMessage"("ticketId","createdAt");

-- Audit
CREATE TABLE "ActivityLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT REFERENCES "User"("id") ON DELETE SET NULL,
  "event" TEXT NOT NULL,
  "meta" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "ActivityLog_event_createdAt_idx" ON "ActivityLog"("event","createdAt");
CREATE INDEX "ActivityLog_userId_idx" ON "ActivityLog"("userId");

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "actorEmail" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "ip" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action","createdAt");
CREATE INDEX "AuditLog_targetType_targetId_idx" ON "AuditLog"("targetType","targetId");
