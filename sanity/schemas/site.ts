/**
 * CMS schemas (plain objects — drop into any Sanity Studio's schema array).
 * Covers product overlays, fabrics, lookbooks, FAQs, pages, testimonials,
 * navigation, footer, banners and global settings with embedded SEO.
 */

export const seoObject = {
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    { name: "title", title: "Meta title", type: "string", validation: (r: { max: (n: number) => unknown }) => r.max(60) },
    { name: "description", title: "Meta description", type: "text", rows: 2 },
    { name: "ogImage", title: "Social share image", type: "image" },
    { name: "canonical", title: "Canonical URL", type: "url" },
    { name: "noIndex", title: "Hide from search engines", type: "boolean", initialValue: false },
  ],
} as const;

export const cmsProductSchema = {
  name: "cmsProduct",
  title: "Product (content overlay)",
  type: "document",
  description: "Editorial content keyed to a Medusa product handle.",
  fields: [
    { name: "handle", title: "Medusa handle", type: "slug", validation: (r: { required: () => unknown }) => r.required() },
    { name: "shortDescription", title: "Short description", type: "text", rows: 2 },
    { name: "benefits", title: "Benefits", type: "array", of: [{ type: "string" }] },
    { name: "features", title: "Features", type: "array", of: [{ type: "string" }] },
    { name: "directions", title: "Directions", type: "text" },
    { name: "warnings", title: "Warnings", type: "array", of: [{ type: "string" }] },
    { name: "gallery", title: "Gallery", type: "array", of: [{ type: "image", options: { hotspot: true } }] },
    { name: "video", title: "Product video URL", type: "url" },
    { name: "fabric", title: "Fabric", type: "reference", to: [{ type: "fabric" }] },
    { name: "lookbookImages", title: "Styled images", type: "array", of: [{ type: "image", options: { hotspot: true } }] },
    { name: "faqs", title: "FAQs", type: "array", of: [{ type: "reference", to: [{ type: "faqItem" }] }] },
    { name: "seo", type: "seo" },
  ],
} as const;

export const fabricSchema = {
  name: "fabric",
  title: "Fabric",
  type: "document",
  description: "Fabric library entry — referenced from product overlays and the fabric care guide.",
  fields: [
    { name: "name", title: "Name", type: "string", validation: (r: { required: () => unknown }) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "name" } },
    { name: "composition", title: "Composition", type: "string", description: "e.g. 100% cotton, 180 GSM" },
    { name: "family", title: "Fabric family", type: "string", options: { list: ["Cotton", "Cotton stretch", "Linen", "Linen blend", "Rayon", "Polyester blend", "Denim"] } },
    { name: "feel", title: "How it feels", type: "text", rows: 2 },
    { name: "care", title: "Care instructions", type: "array", of: [{ type: "string" }] },
    { name: "image", title: "Swatch image", type: "image" },
  ],
} as const;

export const lookbookSchema = {
  name: "lookbook",
  title: "Lookbook",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "season", title: "Season / drop", type: "string" },
    { name: "cover", title: "Cover image", type: "image", options: { hotspot: true } },
    {
      name: "looks",
      title: "Looks",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "image", title: "Image", type: "image", options: { hotspot: true } },
            { name: "caption", title: "Caption", type: "string" },
            { name: "productHandles", title: "Products in this look (Medusa handles)", type: "array", of: [{ type: "string" }] },
          ],
        },
      ],
    },
    { name: "seo", type: "seo" },
  ],
} as const;

export const faqItemSchema = {
  name: "faqItem",
  title: "FAQ",
  type: "document",
  fields: [
    { name: "question", title: "Question", type: "string" },
    { name: "answer", title: "Answer", type: "text" },
    { name: "category", title: "Category", type: "string", options: { list: ["general", "shipping", "returns", "product", "subscription"] }, initialValue: "general" },
    { name: "sortOrder", title: "Sort order", type: "number", initialValue: 0 },
  ],
} as const;

export const testimonialSchema = {
  name: "testimonial",
  title: "Testimonial",
  type: "document",
  fields: [
    { name: "author", title: "Customer name", type: "string" },
    { name: "location", title: "City", type: "string" },
    { name: "rating", title: "Rating", type: "number", validation: (r: { min: (n: number) => { max: (n: number) => unknown } }) => r.min(1).max(5) },
    { name: "quote", title: "Quote", type: "text", rows: 3 },
    { name: "image", title: "Photo", type: "image" },
    { name: "verified", title: "Verified buyer", type: "boolean", initialValue: true },
  ],
} as const;

export const bannerSchema = {
  name: "banner",
  title: "Banner",
  type: "document",
  fields: [
    { name: "title", title: "Internal title", type: "string" },
    { name: "message", title: "Message", type: "string" },
    { name: "href", title: "Link", type: "string" },
    { name: "placement", title: "Placement", type: "string", options: { list: ["announcement", "home-hero", "plp-top", "cart"] } },
    { name: "startsAt", title: "Starts", type: "datetime" },
    { name: "endsAt", title: "Ends", type: "datetime" },
    { name: "isActive", title: "Active", type: "boolean", initialValue: true },
  ],
} as const;

const heroSection = {
  name: "heroSection",
  title: "Hero",
  type: "object",
  fields: [
    { name: "eyebrow", type: "string" },
    { name: "headline", type: "string" },
    { name: "subheadline", type: "text", rows: 2 },
    { name: "primaryCta", type: "object", fields: [{ name: "label", type: "string" }, { name: "href", type: "string" }] },
    { name: "secondaryCta", type: "object", fields: [{ name: "label", type: "string" }, { name: "href", type: "string" }] },
    { name: "image", type: "image", options: { hotspot: true } },
  ],
} as const;

export const homePageSchema = {
  name: "homePage",
  title: "Home Page",
  type: "document",
  fields: [
    { name: "hero", type: "heroSection" },
    { name: "featuredHandles", title: "Featured product handles", type: "array", of: [{ type: "string" }] },
    { name: "testimonials", type: "array", of: [{ type: "reference", to: [{ type: "testimonial" }] }] },
    { name: "seo", type: "seo" },
  ],
} as const;

export const aboutPageSchema = {
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    { name: "story", title: "Story", type: "blockContent" },
    { name: "mission", type: "text" },
    { name: "vision", type: "text" },
    { name: "timeline", title: "Milestones", type: "array", of: [{ type: "object", fields: [{ name: "year", type: "string" }, { name: "title", type: "string" }, { name: "description", type: "text" }] }] },
    { name: "seo", type: "seo" },
  ],
} as const;

export const landingPageSchema = {
  name: "landingPage",
  title: "Landing Page",
  type: "document",
  fields: [
    { name: "title", type: "string" },
    { name: "slug", type: "slug", options: { source: "title" } },
    { name: "hero", type: "heroSection" },
    { name: "body", type: "blockContent" },
    { name: "faqs", type: "array", of: [{ type: "reference", to: [{ type: "faqItem" }] }] },
    { name: "seo", type: "seo" },
  ],
} as const;

const navLink = {
  name: "navLink",
  title: "Link",
  type: "object",
  fields: [
    { name: "title", type: "string" },
    { name: "href", type: "string" },
    { name: "description", type: "string" },
  ],
} as const;

export const navigationSchema = {
  name: "navigation",
  title: "Navigation",
  type: "document",
  fields: [
    {
      name: "items",
      title: "Top-level items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "href", type: "string" },
            { name: "children", type: "array", of: [{ type: "navLink" }] },
          ],
        },
      ],
    },
  ],
} as const;

export const footerSchema = {
  name: "footer",
  title: "Footer",
  type: "document",
  fields: [
    {
      name: "groups",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "title", type: "string" },
            { name: "links", type: "array", of: [{ type: "navLink" }] },
          ],
        },
      ],
    },
    { name: "disclaimer", title: "Footer note", type: "text" },
  ],
} as const;

export const siteSettingsSchema = {
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    { name: "siteName", type: "string" },
    { name: "tagline", type: "string" },
    { name: "defaultSeo", type: "seo" },
    { name: "announcement", type: "object", fields: [{ name: "message", type: "string" }, { name: "href", type: "string" }, { name: "isActive", type: "boolean" }] },
    { name: "social", type: "object", fields: [
      { name: "instagram", type: "url" }, { name: "facebook", type: "url" },
      { name: "twitter", type: "url" }, { name: "youtube", type: "url" }, { name: "linkedin", type: "url" },
    ] },
    { name: "contact", type: "object", fields: [
      { name: "email", type: "string" }, { name: "phone", type: "string" }, { name: "address", type: "text" },
    ] },
  ],
} as const;

export const siteSchemaTypes = [
  seoObject,
  heroSection,
  navLink,
  cmsProductSchema,
  fabricSchema,
  lookbookSchema,
  faqItemSchema,
  testimonialSchema,
  bannerSchema,
  homePageSchema,
  aboutPageSchema,
  landingPageSchema,
  navigationSchema,
  footerSchema,
  siteSettingsSchema,
];
