import React, { useMemo } from 'react';
import { useT } from '../../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../context/SessionContext';
import { BookOpen, ArrowRight } from 'lucide-react';
import { getCourses } from '../../../services/coursesService';
import { storage, STORAGE_KEYS } from '../../../services/storage';
import { CourseProgress } from '../../../features/courses/types';

export const ContinueLearningSection: React.FC = () => {
  const { user } = useSession();
  const t = useT();
  const navigate = useNavigate();

  const lastActiveCourse = useMemo(() => {
    if (!user) return null;

    // Get all user progress
    const allProgress = storage.getJSON<CourseProgress[]>(STORAGE_KEYS.COURSE_PROGRESS, []);
    const userProgress = allProgress.filter(p => p.userId === user.id);

    if (userProgress.length === 0) return null;

    // Sort by most recently updated
    const sorted = userProgress.sort((a, b) => 
      new Date(b.updatedAtIso).getTime() - new Date(a.updatedAtIso).getTime()
    );

    const mostRecent = sorted[0];
    const course = getCourses().find(c => c.id === mostRecent.courseId);
    
    if (!course) return null;

    // Find next lesson to take
    const completedIds = mostRecent.completedLessonIds || [];
    const nextLesson = course.lessons.find(l => !completedIds.includes(l.id));

    return {
      course,
      nextLesson,
      progress: completedIds.length,
      total: course.lessons.length
    };
  }, [user]);

  if (!lastActiveCourse) {
    // Empty state - no courses started yet
    return (
      <section>
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          {t('home.continueLearning')}
        </h2>
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 text-center">
          <BookOpen size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
            {t('home.noCourses')}
          </p>
          <button
            onClick={() => navigate('/courses')}
            className="text-indigo-600 dark:text-indigo-400 font-medium text-sm flex items-center justify-center space-x-1 mx-auto hover:underline"
          >
            <span>{t('home.browseCourses')}</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </section>
    );
  }

  const { course, nextLesson, progress, total } = lastActiveCourse;
  const progressPercent = Math.round((progress / total) * 100);

  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
        {t('home.continueLearning')}
      </h2>
      <div
        onClick={() => {
          if (nextLesson) {
            navigate(`/courses/${course.id}/lessons/${nextLesson.id}`);
          } else {
            navigate(`/courses/${course.id}`);
          }
        }}
        className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-start space-x-3 flex-1">
            <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-full text-indigo-600 dark:text-indigo-400">
              <BookOpen size={20} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-1">
                {course.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {nextLesson ? nextLesson.title : t('courses.completed')}
              </p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>{progress} / {total} {t('home.lessonsCompleted')}</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <div className="text-indigo-600 dark:text-indigo-400 text-xs font-bold flex items-center space-x-1">
            <span>{nextLesson ? t('home.continueCourse') : t('courses.viewAll')}</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </section>
  );
};
