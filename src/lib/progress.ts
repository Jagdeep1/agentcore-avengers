/**
 * Progress Tracking System for The AgentCore Initiative
 *
 * Handles:
 * - Sequential day unlock logic (complete Day N to access Day N+1)
 * - Section completion tracking
 * - Challenge self-assessment persistence
 * - localStorage persistence
 */

export interface Progress {
  sectionsCompleted: Record<string, string[]>; // { "day-1": ["setup", "basics"] }
  challengeChecks: Record<string, string[]>; // { "day-1": ["req-1", "req-2"] }
  highestUnlockedDay: number;
  lastVisited: string;
  theme: 'dark' | 'light' | 'system';
}

const STORAGE_KEY = 'agentcore-initiative-progress';

const DEFAULT_PROGRESS: Progress = {
  sectionsCompleted: {},
  challengeChecks: {},
  highestUnlockedDay: 1,
  lastVisited: '/',
  theme: 'dark',
};

/**
 * Get the current progress from localStorage
 */
export function getProgress(): Progress {
  if (typeof window === 'undefined') {
    return DEFAULT_PROGRESS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_PROGRESS;
    }
    return { ...DEFAULT_PROGRESS, ...JSON.parse(stored) };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

/**
 * Save progress to localStorage
 */
export function saveProgress(progress: Progress): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Failed to save progress:', error);
  }
}

/**
 * Check if a specific day is unlocked
 * Day 1 is always unlocked
 * Day N+1 unlocks when Day N challenge is marked complete
 */
export function isDayUnlocked(dayNumber: number): boolean {
  const progress = getProgress();
  return dayNumber <= progress.highestUnlockedDay;
}

/**
 * Get the sections completed for a specific day
 */
export function getSectionsCompleted(dayNumber: number): string[] {
  const progress = getProgress();
  return progress.sectionsCompleted[`day-${dayNumber}`] || [];
}

/**
 * Mark a section as completed
 */
export function markSectionComplete(dayNumber: number, sectionSlug: string): void {
  const progress = getProgress();
  const dayKey = `day-${dayNumber}`;

  if (!progress.sectionsCompleted[dayKey]) {
    progress.sectionsCompleted[dayKey] = [];
  }

  if (!progress.sectionsCompleted[dayKey].includes(sectionSlug)) {
    progress.sectionsCompleted[dayKey].push(sectionSlug);
  }

  saveProgress(progress);
}

/**
 * Mark a section as incomplete
 */
export function markSectionIncomplete(dayNumber: number, sectionSlug: string): void {
  const progress = getProgress();
  const dayKey = `day-${dayNumber}`;

  if (progress.sectionsCompleted[dayKey]) {
    progress.sectionsCompleted[dayKey] = progress.sectionsCompleted[dayKey].filter(
      (s) => s !== sectionSlug
    );
  }

  saveProgress(progress);
}

/**
 * Get challenge items checked for a specific day
 */
export function getChallengeChecks(dayNumber: number): string[] {
  const progress = getProgress();
  return progress.challengeChecks[`day-${dayNumber}`] || [];
}

/**
 * Toggle a challenge item check
 */
export function toggleChallengeItem(dayNumber: number, itemId: string): boolean {
  const progress = getProgress();
  const dayKey = `day-${dayNumber}`;

  if (!progress.challengeChecks[dayKey]) {
    progress.challengeChecks[dayKey] = [];
  }

  const index = progress.challengeChecks[dayKey].indexOf(itemId);
  let isChecked: boolean;

  if (index === -1) {
    progress.challengeChecks[dayKey].push(itemId);
    isChecked = true;
  } else {
    progress.challengeChecks[dayKey].splice(index, 1);
    isChecked = false;
  }

  saveProgress(progress);
  return isChecked;
}

/**
 * Mark a day as completed (unlocks next day)
 */
export function completeDayChallenge(dayNumber: number): void {
  const progress = getProgress();

  if (dayNumber >= progress.highestUnlockedDay && dayNumber < 5) {
    progress.highestUnlockedDay = dayNumber + 1;
    saveProgress(progress);
  }
}

/**
 * Get completion percentage for a day
 * Based on sections completed out of total sections
 */
export function getDayCompletionPercentage(
  dayNumber: number,
  totalSections: number
): number {
  const completed = getSectionsCompleted(dayNumber);
  if (totalSections === 0) return 0;
  return Math.round((completed.length / totalSections) * 100);
}

/**
 * Get overall course completion percentage
 */
export function getOverallProgress(
  totalSectionsPerDay: Record<number, number>
): number {
  let totalSections = 0;
  let completedSections = 0;

  for (let day = 1; day <= 5; day++) {
    const sections = totalSectionsPerDay[day] || 0;
    totalSections += sections;
    completedSections += getSectionsCompleted(day).length;
  }

  if (totalSections === 0) return 0;
  return Math.round((completedSections / totalSections) * 100);
}

/**
 * Update last visited path
 */
export function setLastVisited(path: string): void {
  const progress = getProgress();
  progress.lastVisited = path;
  saveProgress(progress);
}

/**
 * Get last visited path
 */
export function getLastVisited(): string {
  return getProgress().lastVisited;
}

/**
 * Set theme preference
 */
export function setTheme(theme: 'dark' | 'light' | 'system'): void {
  const progress = getProgress();
  progress.theme = theme;
  saveProgress(progress);
}

/**
 * Get theme preference
 */
export function getTheme(): 'dark' | 'light' | 'system' {
  return getProgress().theme;
}

/**
 * Reset all progress
 */
export function resetProgress(): void {
  saveProgress(DEFAULT_PROGRESS);
}

/**
 * Export progress as shareable URL parameter
 */
export function exportProgress(): string {
  const progress = getProgress();
  return btoa(JSON.stringify(progress));
}

/**
 * Import progress from URL parameter
 */
export function importProgress(encoded: string): boolean {
  try {
    const progress = JSON.parse(atob(encoded)) as Progress;
    saveProgress({ ...DEFAULT_PROGRESS, ...progress });
    return true;
  } catch {
    return false;
  }
}
