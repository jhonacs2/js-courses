import { z, defineCollection } from 'astro:content';

const coursesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    duration: z.string(),
    level: z.string(),
    mascotImage: z.string(),
    accentColor: z.string(),
    sections: z.number(),
    lessons: z.number(),
  }),
});

const lessonsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
    section: z.string(),
    type: z.enum(['theory', 'practice', 'challenge', 'setup', 'reading', 'tool', 'skill']),
    duration: z.string(),
    topics: z.array(z.string()).optional(),
  }),
});

export const collections = {
  'courses': coursesCollection,
  'lessons': lessonsCollection,
};
