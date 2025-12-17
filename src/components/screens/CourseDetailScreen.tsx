
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Play, CheckCircle, Lock, User, ShoppingCart } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { getCourseById, getProgress, hasUserAccessToCourse } from '../../services/coursesService';
import { Course, CourseProgress } from '../../features/courses/types';
import { useSession } from '../../context/SessionContext';
import { useEntitlements } from '../../hooks/useEntitlements';

export const CourseDetailScreen: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const t = useT();
  const { user } = useSession();
  const { isPro } = useEntitlements();
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [progress, setProgress] = useState<CourseProgress | undefined>(undefined);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    if (courseId) {
      setCourse(getCourseById(courseId));
    }
  }, [courseId]);

  useEffect(() => {
    if (user && courseId) {
      setProgress(getProgress(user.id, courseId));
      setHasAccess(hasUserAccessToCourse(user.id, courseId, isPro));
    }
  }, [user, courseId, isPro]);

  if (!course) return <div className="p-8 text-center">Loading...</div>;

  const isStarted = progress && progress.completedLessonIds.length > 0;
  const isFree = !course.price || course.price === 0;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="relative h-56 w-full">
         <img src={course.imageUrl} className="w-full h-full object-cover" alt={course.title} />
         <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
         <div className="absolute top-0 left-0 p-4">
            <button 
              onClick={() => navigate(-1)} 
              className="p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
         </div>
         <div className="absolute bottom-0 left-0 p-6 w-full">
            <span className="text-xs font-bold bg-indigo-600 text-white px-2 py-0.5 rounded mb-2 inline-block">
              {course.category}
            </span>
            <h1 className="text-2xl font-bold text-white mb-1 leading-tight">{course.title}</h1>
            <div className="flex items-center text-white/80 text-sm">
               <User size={14} className="mr-1" />
               {course.mentorName}
            </div>
         </div>
      </div>

      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
         <div>
           <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{course.description}</p>
         </div>

         <div>
           <h2 className="font-bold text-slate-900 dark:text-white mb-4">Lessons</h2>
           <div className="space-y-3">
             {course.lessons.map((lesson, idx) => {
               const isCompleted = progress?.completedLessonIds.includes(lesson.id);
               // Lock lessons if user doesn't have access (after first preview lesson)
               const isLocked = !hasAccess && idx > 0;

               return (
                 <div 
                   key={lesson.id}
                   onClick={() => !isLocked && navigate(`/courses/${course.id}/lessons/${lesson.id}`)}
                   className={`flex items-center p-4 rounded-xl border transition-all
                     ${isLocked 
                       ? 'bg-slate-100 dark:bg-slate-900 border-transparent opacity-70' 
                       : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:border-indigo-200 cursor-pointer shadow-sm'}
                   `}
                 >
                    <div className="mr-4 flex-shrink-0">
                       {isCompleted ? (
                         <div className="text-green-500"><CheckCircle size={24} /></div>
                       ) : (
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                           ${isLocked ? 'bg-slate-300 dark:bg-slate-700 text-slate-500' : `bg-indigo-100 dark:bg-indigo-900/30 text-${Brand.colors.primary}`}
                         `}>
                           {isLocked ? <Lock size={14} /> : idx + 1}
                         </div>
                       )}
                    </div>
                    <div className="flex-1">
                       <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{lesson.title}</h3>
                       <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{lesson.durationMin} min</p>
                    </div>
                    {!isLocked && !isCompleted && (
                      <div className="bg-slate-100 dark:bg-slate-700 p-2 rounded-full">
                         <Play size={16} className={`text-${Brand.colors.primary} dark:text-white`} fill="currentColor" />
                      </div>
                    )}
                 </div>
               );
             })}
           </div>
         </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 sticky bottom-0 z-20 safe-area-pb space-y-3">
         {/* Price Badge (if paid course and no access) */}
         {!isFree && !hasAccess && (
           <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
             <div>
               <p className="text-sm text-slate-600 dark:text-slate-400">Course Price</p>
               <p className="text-2xl font-bold text-slate-900 dark:text-white">${course.price}</p>
               {course.isProOnly && (
                 <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1">
                   Free with Pro membership
                 </p>
               )}
             </div>
             <ShoppingCart className="text-slate-400" size={32} />
           </div>
         )}

         {/* Action Button */}
         {hasAccess ? (
           <button
             onClick={() => navigate(`/courses/${course.id}/lessons/${course.lessons[0].id}`)}
             className={`w-full py-3 flex items-center justify-center space-x-2 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none`}
           >
             <Play size={20} />
             <span>{isStarted ? t('courses.continue') : t('courses.start')}</span>
           </button>
         ) : (
           <button
             onClick={() => navigate(`/payment?purpose=course&amount=${course.price}&relatedId=${course.id}&title=${encodeURIComponent(course.title)}`)}
             className="w-full py-3 flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold transition-all shadow-lg"
           >
             <ShoppingCart size={20} />
             <span>Buy Course - ${course.price}</span>
           </button>
         )}
      </div>
    </div>
  );
};
