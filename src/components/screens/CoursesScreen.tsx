
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Lock, BookOpen } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { getPublishedCourses, seedCoursesIfEmpty, getProgress } from '../../services/coursesService';
import { Course } from '../../features/courses/types';
import { useSession } from '../../context/SessionContext';

export const CoursesScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { user } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    seedCoursesIfEmpty();
    setCourses(getPublishedCourses()); // Only show published courses
  }, []);

  const filters = ['All', 'Mindfulness', 'Astrology', 'Self-Care'];

  const filteredCourses = activeFilter === 'All' 
    ? courses 
    : courses.filter(c => c.category === activeFilter);

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('courses.title')}</h1>
      </div>

      <div className="p-4 sticky top-14 bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur z-10">
         <div className="flex space-x-2 overflow-x-auto no-scrollbar">
           {filters.map(filter => (
             <button
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors border
                 ${activeFilter === filter 
                   ? `bg-${Brand.colors.primary} border-${Brand.colors.primary} text-white` 
                   : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                 }`}
             >
               {filter}
             </button>
           ))}
        </div>
      </div>

      <div className="p-4 space-y-4 pb-20">
        {filteredCourses.map(course => {
          const progress = user ? getProgress(user.id, course.id) : undefined;
          const completedCount = progress?.completedLessonIds.length || 0;
          const totalCount = course.lessons.length;
          const percent = Math.round((completedCount / totalCount) * 100);

          return (
            <div 
              key={course.id}
              onClick={() => navigate(`/courses/${course.id}`)}
              className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="h-32 w-full bg-slate-200 relative overflow-hidden">
                <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={course.title} />
                {course.isProOnly && (
                  <div className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
                    <Lock size={12} className="mr-1" />
                    {t('courses.proBadge')}
                  </div>
                )}
                <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-semibold px-2 py-1 rounded text-slate-800 dark:text-slate-200">
                  {course.category}
                </div>
              </div>
              <div className="p-4">
                 <h3 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">{course.title}</h3>
                 <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{course.description}</p>
                 
                 <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <BookOpen size={14} className="mr-1" />
                      {totalCount} lessons
                    </span>
                    <span>{course.mentorName}</span>
                 </div>

                 {completedCount > 0 && (
                   <div className="mt-3">
                     <div className="flex justify-between text-[10px] mb-1 text-slate-500">
                       <span>Progress</span>
                       <span>{percent}%</span>
                     </div>
                     <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                       <div className={`h-full bg-${Brand.colors.primary}`} style={{ width: `${percent}%` }}></div>
                     </div>
                   </div>
                 )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
