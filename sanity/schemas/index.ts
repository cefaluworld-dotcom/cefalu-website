import { schemaTypes as blogSchemaTypes } from "./post";
import { siteSchemaTypes } from "./site";

/** Full CMS schema set — import into a Sanity Studio's `schema.types`. */
export const allSchemaTypes = [...blogSchemaTypes, ...siteSchemaTypes];
