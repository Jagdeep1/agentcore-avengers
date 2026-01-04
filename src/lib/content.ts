/**
 * Content Helpers for The AgentCore Initiative
 */

import { getCollection, type CollectionEntry } from 'astro:content';
import type { DayInfo, SectionInfo } from '@/types/content';
import { DAY_COLORS, DAY_TITLES } from '@/types/content';

/**
 * Get all sections for a specific day, sorted by order
 */
export async function getDaySections(dayNumber: number): Promise<CollectionEntry<'days'>[]> {
  const allDays = await getCollection('days');

  return allDays
    .filter((entry) => entry.data.dayNumber === dayNumber && entry.data.published)
    .sort((a, b) => a.data.order - b.data.order);
}

/**
 * Get day overview entry (order: 0)
 */
export async function getDayOverview(dayNumber: number): Promise<CollectionEntry<'days'> | undefined> {
  const sections = await getDaySections(dayNumber);
  return sections.find((s) => s.data.order === 0);
}

/**
 * Get all days info for navigation
 */
export async function getAllDaysInfo(): Promise<DayInfo[]> {
  const days: DayInfo[] = [];

  for (let i = 1; i <= 5; i++) {
    const sections = await getDaySections(i);
    const overview = sections.find((s) => s.data.order === 0);

    days.push({
      number: i,
      title: DAY_TITLES[i].title,
      avengersTitle: overview?.data.avengersTitle || DAY_TITLES[i].avengers,
      focus: overview?.data.focus || DAY_TITLES[i].focus,
      isUnlocked: true, // Will be updated client-side
      completionPercentage: 0, // Will be updated client-side
      slug: `day-${i}`,
      accentColor: DAY_COLORS[i],
    });
  }

  return days;
}

/**
 * Get sections info for sidebar navigation
 */
export async function getSectionsInfo(dayNumber: number): Promise<SectionInfo[]> {
  const sections = await getDaySections(dayNumber);

  return sections.map((section) => ({
    slug: section.slug.split('/').pop() || section.slug,
    title: section.data.title,
    order: section.data.order,
    isCompleted: false, // Will be updated client-side
  }));
}

/**
 * Get challenge for a specific day
 */
export async function getDayChallenge(
  dayNumber: number
): Promise<CollectionEntry<'challenges'> | undefined> {
  const challenges = await getCollection('challenges');
  return challenges.find((c) => c.data.dayNumber === dayNumber);
}

/**
 * Get all troubleshooting entries, optionally filtered by day
 */
export async function getTroubleshooting(
  dayNumber?: number
): Promise<CollectionEntry<'troubleshooting'>[]> {
  const entries = await getCollection('troubleshooting');

  if (dayNumber !== undefined) {
    return entries.filter(
      (e) => e.data.dayNumber === dayNumber || e.data.dayNumber === undefined
    );
  }

  return entries;
}

/**
 * Get troubleshooting entries by category
 */
export async function getTroubleshootingByCategory(
  category: string
): Promise<CollectionEntry<'troubleshooting'>[]> {
  const entries = await getCollection('troubleshooting');
  return entries.filter((e) => e.data.category === category);
}

/**
 * Get all reference docs sorted by order
 */
export async function getReferenceDocs(): Promise<CollectionEntry<'reference'>[]> {
  const docs = await getCollection('reference');
  return docs.sort((a, b) => a.data.order - b.data.order);
}

/**
 * Generate table of contents from headings
 */
export function generateToc(
  headings: { depth: number; slug: string; text: string }[]
): { depth: number; slug: string; text: string }[] {
  // Only include h2 and h3 for cleaner ToC
  return headings.filter((h) => h.depth >= 2 && h.depth <= 3);
}

/**
 * Get previous and next sections for navigation
 */
export async function getAdjacentSections(
  dayNumber: number,
  currentSlug: string
): Promise<{
  prev: CollectionEntry<'days'> | null;
  next: CollectionEntry<'days'> | null;
}> {
  const sections = await getDaySections(dayNumber);
  const currentIndex = sections.findIndex(
    (s) => s.slug.split('/').pop() === currentSlug || s.slug === currentSlug
  );

  return {
    prev: currentIndex > 0 ? sections[currentIndex - 1] : null,
    next: currentIndex < sections.length - 1 ? sections[currentIndex + 1] : null,
  };
}

/**
 * Calculate tier progress from checked items
 */
export function calculateTierProgress(
  requirements: { tier: string }[],
  checkedIds: string[]
): {
  required: { total: number; completed: number };
  bronze: { total: number; completed: number };
  silver: { total: number; completed: number };
  gold: { total: number; completed: number };
  currentTier: 'none' | 'required' | 'bronze' | 'silver' | 'gold';
} {
  const counts = {
    required: { total: 0, completed: 0 },
    bronze: { total: 0, completed: 0 },
    silver: { total: 0, completed: 0 },
    gold: { total: 0, completed: 0 },
  };

  requirements.forEach((req, index) => {
    const tier = req.tier as keyof typeof counts;
    counts[tier].total++;
    if (checkedIds.includes(`req-${index}`)) {
      counts[tier].completed++;
    }
  });

  // Determine current tier based on completion
  let currentTier: 'none' | 'required' | 'bronze' | 'silver' | 'gold' = 'none';

  if (counts.required.completed === counts.required.total) {
    currentTier = 'required';
    if (counts.bronze.completed === counts.bronze.total) {
      currentTier = 'bronze';
      if (counts.silver.completed === counts.silver.total) {
        currentTier = 'silver';
        if (counts.gold.completed === counts.gold.total) {
          currentTier = 'gold';
        }
      }
    }
  }

  return { ...counts, currentTier };
}
