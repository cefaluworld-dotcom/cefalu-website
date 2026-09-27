/**
 * Sanity schema definitions as plain objects — copy into any Sanity Studio
 * project's schema array (no `sanity` package dependency required here).
 */
export const postSchema = {
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string", validation: (r: { required: () => unknown }) => r.required() },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title", maxLength: 96 } },
    { name: "excerpt", title: "Excerpt", type: "text", rows: 3 },
    { name: "mainImage", title: "Main image", type: "image", options: { hotspot: true } },
    { name: "author", title: "Author", type: "reference", to: [{ type: "author" }] },
    {
      name: "categories",
      title: "Categories",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }],
    },
    { name: "publishedAt", title: "Published at", type: "datetime" },
    { name: "body", title: "Body", type: "blockContent" },
  ],
} as const;

export const authorSchema = {
  name: "author",
  title: "Author",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "image", title: "Image", type: "image", options: { hotspot: true } },
    { name: "bio", title: "Bio", type: "text", rows: 3 },
  ],
} as const;

export const categorySchema = {
  name: "category",
  title: "Category",
  type: "document",
  fields: [
    { name: "title", title: "Title", type: "string" },
    { name: "slug", title: "Slug", type: "slug", options: { source: "title" } },
    { name: "description", title: "Description", type: "text" },
  ],
} as const;

export const blockContentSchema = {
  name: "blockContent",
  title: "Block Content",
  type: "array",
  of: [
    {
      type: "block",
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            type: "object",
            title: "Link",
            fields: [{ name: "href", type: "url", title: "URL" }],
          },
        ],
      },
    },
    { type: "image", options: { hotspot: true } },
  ],
} as const;

export const schemaTypes = [postSchema, authorSchema, categorySchema, blockContentSchema];
