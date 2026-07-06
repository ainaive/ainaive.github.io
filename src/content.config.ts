import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

import { appSchema } from "./lib/schema";

const apps = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/apps" }),
  schema: appSchema,
});

export const collections = { apps };
