/**
 * TypeScript Types for The AgentCore Initiative
 */

// Day information for navigation
export interface DayInfo {
  number: number;
  title: string;
  avengersTitle: string;
  focus: string;
  isUnlocked: boolean;
  completionPercentage: number;
  slug: string;
  accentColor: string;
}

// Section within a day
export interface SectionInfo {
  slug: string;
  title: string;
  order: number;
  isCompleted: boolean;
}

// Challenge requirement item
export interface RequirementItem {
  id: string;
  text: string;
  tier: 'required' | 'bronze' | 'silver' | 'gold';
  hints?: string[];
  isChecked: boolean;
}

// Controlled disaster scenario
export interface DisasterScenario {
  name: string;
  symptom: string;
  cause: string;
  motivation: string;
}

// Error entry in troubleshooting
export interface ErrorEntry {
  code?: string;
  message: string;
  solution: string;
  relatedDays?: number[];
}

// Navigation item
export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
  isDisabled?: boolean;
  icon?: string;
  children?: NavItem[];
}

// Breadcrumb item
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// Table of contents heading
export interface TocHeading {
  depth: number;
  slug: string;
  text: string;
}

// Code tab for multi-file examples
export interface CodeTab {
  label: string;
  language: string;
  code: string;
  filename?: string;
}

// Resource link
export interface ResourceLink {
  title: string;
  url: string;
  description?: string;
}

// Day accent colors mapping
export const DAY_COLORS: Record<number, string> = {
  1: '#3b82f6', // Blue - The First Avenger
  2: '#ef4444', // Red - Age of Ultron
  3: '#8b5cf6', // Purple - Infinity War
  4: '#10b981', // Green - Endgame
  5: '#f59e0b', // Amber - Assemble
};

// Day titles mapping
export const DAY_TITLES: Record<number, { title: string; avengers: string; focus: string }> = {
  1: {
    title: 'Day 1',
    avengers: 'The First Avenger',
    focus: 'Foundation - Strands Agent + AgentCore Runtime',
  },
  2: {
    title: 'Day 2',
    avengers: 'Age of Ultron',
    focus: 'Identity + AgentCore Gateway',
  },
  3: {
    title: 'Day 3',
    avengers: 'Infinity War',
    focus: 'Memory + Tools',
  },
  4: {
    title: 'Day 4',
    avengers: 'Endgame',
    focus: 'Guardrails + Observability',
  },
  5: {
    title: 'Day 5',
    avengers: 'Assemble',
    focus: 'Multi-agent Capstone',
  },
};

// Tier configuration
export const TIER_CONFIG = {
  required: {
    label: 'Required',
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.2)',
  },
  bronze: {
    label: 'Bronze',
    color: '#cd7f32',
    bgColor: 'rgba(205, 127, 50, 0.2)',
  },
  silver: {
    label: 'Silver',
    color: '#c0c0c0',
    bgColor: 'rgba(192, 192, 192, 0.2)',
  },
  gold: {
    label: 'Gold',
    color: '#ffd700',
    bgColor: 'rgba(255, 215, 0, 0.2)',
  },
} as const;
