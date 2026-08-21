import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const profile = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/profile" }),
  schema: z.object({
    name: z.string().min(1),
    role: z.string().min(1),
    pitch: z.string().min(1),
    availability: z.string().min(1),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string().min(1),
    year: z.number().int().min(2020).max(2030),
    summary: z.string().min(1),
    stack: z.array(z.string().min(1)).min(1),
    repoUrl: z.string().url(),
    demoUrl: z.string().url().optional(),
    image: z.string().optional(),
    order: z.number().int().optional(),
  }),
});

const skills = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/skills" }),
  schema: z.object({
    categories: z
      .array(
        z.object({
          name: z.string().min(1),
          tags: z.array(z.string().min(1)).min(1),
        }),
      )
      .min(1),
  }),
});

const contact = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/contact" }),
  schema: z.object({
    email: z.string().email(),
    github: z.string().url(),
    name: z.string().min(1).optional(),
  }),
});

export const collections = { profile, projects, skills, contact };
