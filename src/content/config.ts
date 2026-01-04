import { defineCollection, z } from 'astro:content';

/**
 * Content Collections Schema for The AgentCore Initiative
 *
 * Collections:
 * - days: Main course content organized by day
 * - challenges: Challenge specifications with rubrics
 * - troubleshooting: Error reference and solutions
 * - reference: Additional resources (costs, cleanup, glossary)
 */

// Schema for controlled disaster scenarios
const controlledDisasterSchema = z.object({
  name: z.string(),
  symptom: z.string(),
  cause: z.string(),
  motivation: z.string(),
});

// Schema for challenge requirements with tier system
const requirementSchema = z.object({
  id: z.string(),
  text: z.string(),
  tier: z.enum(['required', 'bronze', 'silver', 'gold']),
  hints: z.array(z.string()).optional(),
});

// Main course content collection (days)
const daysCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    dayNumber: z.number().min(1).max(5),
    avengersTitle: z.string(),
    focus: z.string(),
    description: z.string(),
    prerequisites: z.array(z.string()).optional(),
    estimatedTime: z.string(),
    objectives: z.array(z.string()),
    controlledDisasters: z.array(controlledDisasterSchema).optional(),
    starterTemplate: z.string().optional(),
    order: z.number(),
    published: z.boolean().default(true),
  }),
});

// Challenge specifications collection
const challengesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    dayNumber: z.number().min(1).max(5),
    title: z.string(),
    description: z.string(),
    requirements: z.array(requirementSchema),
    resources: z.array(z.object({
      title: z.string(),
      url: z.string(),
    })).optional(),
    starterTemplate: z.string().optional(),
  }),
});

// Troubleshooting collection
const troubleshootingCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    dayNumber: z.number().optional(),
    category: z.enum(['setup', 'runtime', 'gateway', 'identity', 'memory', 'tools', 'observability', 'general']),
    errors: z.array(z.object({
      code: z.string().optional(),
      message: z.string(),
      solution: z.string(),
      relatedDays: z.array(z.number()).optional(),
    })).optional(),
  }),
});

// Reference documentation collection
const referenceCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number().default(0),
  }),
});

export const collections = {
  days: daysCollection,
  challenges: challengesCollection,
  troubleshooting: troubleshootingCollection,
  reference: referenceCollection,
};
