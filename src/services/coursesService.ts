
import { Course, CourseProgress, Lesson } from '../features/courses/types';
import { storage } from './storage';
import { CourseListSchema, CourseProgressListSchema } from '../schemas/courses.schema';

const COURSES_KEY = 'mhs_courses_v1';
const PROGRESS_KEY = 'mhs_courses_progress_v1';

export const getCourses = (): Course[] => {
  return storage.getValidatedJSON<Course[]>(COURSES_KEY, CourseListSchema, []);
};

export const getCourseById = (id: string): Course | undefined => {
  return getCourses().find(c => c.id === id);
};

export const getLessonById = (courseId: string, lessonId: string): Lesson | undefined => {
  const course = getCourseById(courseId);
  return course?.lessons.find(l => l.id === lessonId);
};

export const getProgress = (userId: string, courseId: string): CourseProgress | undefined => {
  const allProgress = storage.getValidatedJSON<CourseProgress[]>(PROGRESS_KEY, CourseProgressListSchema, []);
  return allProgress.find(p => p.userId === userId && p.courseId === courseId);
};

export const markLessonCompleted = (userId: string, courseId: string, lessonId: string) => {
  const allProgress = storage.getValidatedJSON<CourseProgress[]>(PROGRESS_KEY, CourseProgressListSchema, []);
  let progress = allProgress.find(p => p.userId === userId && p.courseId === courseId);

  if (!progress) {
    progress = {
      userId,
      courseId,
      completedLessonIds: [],
      startedAtIso: new Date().toISOString(),
      updatedAtIso: new Date().toISOString()
    };
    allProgress.push(progress);
  }

  if (!progress.completedLessonIds.includes(lessonId)) {
    progress.completedLessonIds.push(lessonId);
    progress.updatedAtIso = new Date().toISOString();
  }

  storage.setJSON(PROGRESS_KEY, allProgress);
};

/**
 * CRUD Operations for Courses (Mentor/Admin)
 */

export const createCourse = (data: {
  title: string;
  description: string;
  mentorId: string;
  mentorName: string;
  category: 'Mindfulness' | 'Astrology' | 'Self-Care' | 'Spirituality';
  imageUrl?: string;
  isProOnly?: boolean;
}): Course => {
  const courses = getCourses();
  const newCourse: Course = {
    id: `c_${Date.now()}`,
    ...data,
    lessons: [],
    createdAtIso: new Date().toISOString(),
    status: 'draft', // draft | published | archived
  };
  courses.push(newCourse);
  storage.setJSON(COURSES_KEY, courses);
  return newCourse;
};

export const updateCourse = (courseId: string, updates: Partial<Course>): Course | null => {
  const courses = getCourses();
  const index = courses.findIndex(c => c.id === courseId);
  if (index === -1) return null;

  courses[index] = { ...courses[index], ...updates, updatedAtIso: new Date().toISOString() };
  storage.setJSON(COURSES_KEY, courses);
  return courses[index];
};

export const deleteCourse = (courseId: string): boolean => {
  const courses = getCourses();
  const filtered = courses.filter(c => c.id !== courseId);
  if (filtered.length === courses.length) return false;
  storage.setJSON(COURSES_KEY, filtered);
  return true;
};

export const publishCourse = (courseId: string): Course | null => {
  return updateCourse(courseId, { status: 'published' });
};

export const archiveCourse = (courseId: string): Course | null => {
  return updateCourse(courseId, { status: 'archived' });
};

/**
 * Lesson Management
 */

export const createLesson = (courseId: string, data: {
  title: string;
  content: string;
  durationMin: number;
}): Lesson | null => {
  const course = getCourseById(courseId);
  if (!course) return null;

  const newLesson: Lesson = {
    id: `l_${Date.now()}`,
    courseId,
    title: data.title,
    content: data.content,
    durationMin: data.durationMin,
    order: course.lessons.length + 1,
  };

  course.lessons.push(newLesson);
  updateCourse(courseId, { lessons: course.lessons });
  return newLesson;
};

export const updateLesson = (courseId: string, lessonId: string, updates: Partial<Lesson>): Lesson | null => {
  const course = getCourseById(courseId);
  if (!course) return null;

  const index = course.lessons.findIndex(l => l.id === lessonId);
  if (index === -1) return null;

  course.lessons[index] = { ...course.lessons[index], ...updates };
  updateCourse(courseId, { lessons: course.lessons });
  return course.lessons[index];
};

export const deleteLesson = (courseId: string, lessonId: string): boolean => {
  const course = getCourseById(courseId);
  if (!course) return false;

  const filtered = course.lessons.filter(l => l.id !== lessonId);
  if (filtered.length === course.lessons.length) return false;

  // Reorder
  filtered.forEach((l, i) => l.order = i + 1);
  updateCourse(courseId, { lessons: filtered });
  return true;
};

export const reorderLessons = (courseId: string, lessonIds: string[]): boolean => {
  const course = getCourseById(courseId);
  if (!course) return false;

  const reordered = lessonIds
    .map(id => course.lessons.find(l => l.id === id))
    .filter(Boolean) as Lesson[];

  reordered.forEach((l, i) => l.order = i + 1);
  updateCourse(courseId, { lessons: reordered });
  return true;
};

/**
 * Queries
 */

export const getCoursesByMentor = (mentorId: string): Course[] => {
  return getCourses().filter(c => c.mentorId === mentorId);
};

export const getPublishedCourses = (): Course[] => {
  return getCourses().filter(c => c.status === 'published' || !c.status);
};

export const seedCoursesIfEmpty = () => {
  if (getCourses().length > 0) return;

  const seeds: Course[] = [
    {
      id: 'c1',
      title: 'Mindfulness for Beginners',
      description: 'Learn the basics of mindfulness meditation and how to apply it to your daily life to reduce stress.',
      mentorId: 'm1',
      mentorName: 'Sarah Johnson',
      imageUrl: 'https://picsum.photos/seed/c1/400/250',
      category: 'Mindfulness',
      lessons: [
        { id: 'l1', courseId: 'c1', title: 'What is Mindfulness?', durationMin: 5, order: 1, content: 'Mindfulness is the basic human ability to be fully present, aware of where we are and what we’re doing, and not overly reactive or overwhelmed by what’s going on around us.\n\n### Key Principles\n* Awareness\n* Non-judgment\n* In the moment' },
        { id: 'l2', courseId: 'c1', title: 'Your First Meditation', durationMin: 10, order: 2, content: 'Sit comfortably. Close your eyes. Focus on your breath. Inhale... Exhale... \n\nWhenever your mind wanders, gently bring it back to your breath.' },
        { id: 'l3', courseId: 'c1', title: 'Mindful Eating', durationMin: 15, order: 3, content: 'Eating is something we do every day. Turn it into a meditation by slowing down and savoring every bite.' }
      ]
    },
    {
      id: 'c2',
      title: 'Astrology 101: The Big Three',
      description: 'Understand your Sun, Moon, and Rising signs and what they say about your personality.',
      mentorId: 'm2',
      mentorName: 'David Chen',
      imageUrl: 'https://picsum.photos/seed/c2/400/250',
      category: 'Astrology',
      isProOnly: true,
      lessons: [
        { id: 'l4', courseId: 'c2', title: 'The Sun Sign', durationMin: 10, order: 1, content: 'Your Sun sign represents your core essence, your ego, and your life force.' },
        { id: 'l5', courseId: 'c2', title: 'The Moon Sign', durationMin: 12, order: 2, content: 'The Moon rules your emotions, instincts, and what you need to feel safe.' },
        { id: 'l6', courseId: 'c2', title: 'The Rising Sign', durationMin: 15, order: 3, content: 'The Ascendant or Rising sign is the mask you wear and your first impression on others.' }
      ]
    },
    {
      id: 'c3',
      title: 'Heal Your Inner Child',
      description: 'A gentle journey to reconnect with your younger self and heal past emotional wounds.',
      mentorId: 'm3',
      mentorName: 'Elena Petrova',
      imageUrl: 'https://picsum.photos/seed/c3/400/250',
      category: 'Self-Care',
      lessons: [
        { id: 'l7', courseId: 'c3', title: 'Meeting Your Inner Child', durationMin: 20, order: 1, content: 'Visualize yourself at age 5. What does she/he need? Safe space? A hug? Validation?' },
        { id: 'l8', courseId: 'c3', title: 'Writing a Letter', durationMin: 30, order: 2, content: 'Write a letter to your younger self. Tell them everything turned out okay.' }
      ]
    },
    {
      id: 'c4',
      title: 'Stoic Resilience',
      description: 'Ancient philosophy for modern mental strength.',
      mentorId: 'm4',
      mentorName: 'Marcus Aurelius',
      imageUrl: 'https://picsum.photos/seed/c4/400/250',
      category: 'Spirituality',
      lessons: [
        { id: 'l9', courseId: 'c4', title: 'The Dichotomy of Control', durationMin: 8, order: 1, content: 'Some things are up to us, some things are not. Focus only on what is up to you.' }
      ]
    }
  ];

  storage.setJSON(COURSES_KEY, seeds);
};
