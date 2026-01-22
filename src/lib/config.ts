import pkg from '../../package.json';

interface CourseConfig {
  publishedDays: number[];
}

export const courseConfig: CourseConfig = {
  publishedDays: (pkg as any).course?.publishedDays ?? [1]
};

export function isDayPublished(dayNumber: number): boolean {
  return courseConfig.publishedDays.includes(dayNumber);
}
