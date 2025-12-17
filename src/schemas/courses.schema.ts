
import { z } from 'zod';

export const LessonSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  title: z.string(),
  durationMin: z.number(),
  content: z.string(),
  order: z.number(),
});

export const CourseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  mentorId: z.string(),
  mentorName: z.string(),
  imageUrl: z.string().optional(),
  category: z.enum(['Mindfulness', 'Astrology', 'Self-Care', 'Spirituality']),
  lessons: z.array(LessonSchema),
  isProOnly: z.boolean().optional(),
});

export const CourseProgressSchema = z.object({
  courseId: z.string(),
  userId: z.string(),
  completedLessonIds: z.array(z.string()),
  startedAtIso: z.string(),
  updatedAtIso: z.string(),
});

export const CourseListSchema = z.array(CourseSchema);
export const CourseProgressListSchema = z.array(CourseProgressSchema);
