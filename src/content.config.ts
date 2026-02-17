import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    year: z.number(),
    order: z.number(),
    theme: z.object({
      bg: z.string(),
      text: z.string(),
      link: z.string(),
      highlight: z.string().optional(),
      border: z.string().optional(),
    }),
    layout: z.enum(["standard", "custom"]).default("standard"),
    component: z.string().optional(),
  }),
});

export const collections = { projects };
