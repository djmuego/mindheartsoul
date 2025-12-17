
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, ArrowRight, Check } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { getCourseById, getLessonById, markLessonCompleted, getProgress, hasUserAccessToCourse } from '../../services/coursesService';
import { Course, Lesson } from '../../features/courses/types';
import { useSession } from '../../context/SessionContext';
import { useEntitlements } from '../../hooks/useEntitlements';
import { addNotification } from '../../services/notificationsService';

export const LessonScreen: React.FC = () => {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>();
  const navigate = useNavigate();
  const t = useT();
  const { user } = useSession();
  const { isPro } = useEntitlements();
  
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [lesson, setLesson] = useState<Lesson | undefined>(undefined);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (courseId && lessonId && user) {
      const loadedCourse = getCourseById(courseId);
      const loadedLesson = getLessonById(courseId, lessonId);
      
      setCourse(loadedCourse);
      setLesson(loadedLesson);
      
      if (loadedCourse && loadedLesson) {
        // Check if user has access to this course
        const access = hasUserAccessToCourse(user.id, courseId, isPro);
        
        // Check if lesson is already completed
        const progress = getProgress(user.id, courseId);
        setIsCompleted(progress?.completedLessonIds.includes(lessonId) || false);
        
        // Pro-gating: Check if this is a paid lesson without access
        const lessonIndex = loadedCourse.lessons.findIndex(l => l.id === lessonId);
        const isFirstLesson = lessonIndex === 0;
        
        // If not first lesson and no access, redirect to paywall
        if (!isFirstLesson && !access && loadedCourse.price && loadedCourse.price > 0) {
          // User tried to access locked lesson directly
          navigate(`/courses/${courseId}`, { replace: true });
        }
      }
    }
  }, [courseId, lessonId, user, isPro, navigate]);

  const handleComplete = () => {
    if (user && course && lesson && !isCompleted) {
      // Mark as completed
      markLessonCompleted(user.id, course.id, lesson.id);
      setIsCompleted(true);
      
      // Create notification
      addNotification({
        userId: user.id,
        type: 'system_alert',
        titleKey: 'notifications.lessonCompleted',
        bodyKey: lesson.title,
        payload: { courseId: course.id, lessonId: lesson.id }
      });
      
      // Find next lesson
      const currentIndex = course.lessons.findIndex(l => l.id === lesson.id);
      const nextLesson = course.lessons[currentIndex + 1];
      
      if (nextLesson) {
        // Navigate to next lesson after short delay
        setTimeout(() => {
          navigate(`/courses/${course.id}/lessons/${nextLesson.id}`);
        }, 500);
      } else {
        // Course completed, go back to course detail
        setTimeout(() => {
          navigate(`/courses/${course.id}`);
        }, 1000);
      }
    }
  };

  if (!course || !lesson) {
    return (
      <div className="min-h-full bg-white dark:bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center">
          <p className="text-slate-600 dark:text-slate-400">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-white dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 z-20">
        <button 
          onClick={() => navigate(`/courses/${course.id}`)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <div className="text-center">
           <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Lesson {lesson.order}</span>
           <div className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden">
              <div className={`h-full bg-${Brand.colors.primary}`} style={{ width: `${(lesson.order / course.lessons.length) * 100}%` }}></div>
           </div>
        </div>
        <div className="w-8"></div>
      </div>

      <div className="flex-1 p-6 pb-24 max-w-lg mx-auto w-full">
         <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">{lesson.title}</h1>
         
         <div className="prose dark:prose-invert prose-slate prose-lg">
           {lesson.content.split('\n').map((para, i) => {
             if (para.startsWith('###')) return <h3 key={i} className="font-bold text-lg mt-6 mb-2">{para.replace('###', '')}</h3>;
             if (para.startsWith('*')) return <li key={i} className="ml-4">{para.replace('*', '')}</li>;
             return <p key={i} className="mb-4">{para}</p>;
           })}
         </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20 safe-area-pb">
         {isCompleted ? (
           <div className="w-full py-3 flex items-center justify-center space-x-2 bg-green-600 text-white rounded-xl font-bold">
             <Check size={20} />
             <span>{t('courses.completed')}</span>
           </div>
         ) : (
           <button
             onClick={handleComplete}
             disabled={isCompleted}
             className={`w-full py-3 flex items-center justify-center space-x-2 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 disabled:cursor-not-allowed`}
           >
             <span>{t('courses.markComplete')}</span>
             <ArrowRight size={18} />
           </button>
         )}
      </div>
    </div>
  );
};
