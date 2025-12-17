
export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  durationMin: number;
  content: string; // Markdown supported
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  mentorId: string; // Link to a mentor mock
  mentorName: string;
  imageUrl?: string;
  category: 'Mindfulness' | 'Astrology' | 'Self-Care' | 'Spirituality';
  lessons: Lesson[];
  isProOnly?: boolean;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  completedLessonIds: string[];
  startedAtIso: string;
  updatedAtIso: string;
}
