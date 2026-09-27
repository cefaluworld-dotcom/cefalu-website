import { groq } from "next-sanity";

export const postFields = groq`
  _id,
  title,
  "slug": slug.current,
  excerpt,
  mainImage,
  publishedAt,
  "author": author->{name, image},
  "categories": categories[]->{title, "slug": slug.current},
  "bodyWords": length(string::split(pt::text(body), " "))
`;

/**
 * Paginated feed with optional search ($q as "term*") and category slug
 * filter ($category, "" = all).
 */
export const filteredPostsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    ($q == "*" || title match $q || excerpt match $q) &&
    ($category == "" || $category in categories[]->slug.current)
  ] | order(publishedAt desc) [$start...$end] {
    ${postFields}
  }
`;

export const filteredPostsCountQuery = groq`
  count(*[
    _type == "post" &&
    defined(slug.current) &&
    ($q == "*" || title match $q || excerpt match $q) &&
    ($category == "" || $category in categories[]->slug.current)
  ])
`;

export const allPostsQuery = groq`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [$start...$end] {
    ${postFields}
  }
`;

export const postBySlugQuery = groq`
  *[_type == "post" && slug.current == $slug][0] {
    ${postFields},
    body
  }
`;

export const relatedPostsQuery = groq`
  *[
    _type == "post" &&
    defined(slug.current) &&
    slug.current != $slug &&
    count((categories[]->slug.current)[@ in $categories]) > 0
  ] | order(publishedAt desc) [0...3] {
    ${postFields}
  }
`;

export const postCategoriesQuery = groq`
  array::unique(*[_type == "post" && defined(slug.current)].categories[]->{title, "slug": slug.current})
`;

export const postSlugsQuery = groq`
  *[_type == "post" && defined(slug.current)][].slug.current
`;

export const postsCountQuery = groq`count(*[_type == "post" && defined(slug.current)])`;
