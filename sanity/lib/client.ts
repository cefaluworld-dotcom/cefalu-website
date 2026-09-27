import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

export const sanityClient = createClient({
  projectId: projectId || "placeholder-not-configured",
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === "production",
  perspective: "published",
  token: process.env.SANITY_API_READ_TOKEN,
});
