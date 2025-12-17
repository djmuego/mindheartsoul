
import React from 'react';
import { useT } from '../../../i18n/useT';
import { Sparkles, Moon, Star, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FeaturedContentSection: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();

  const items = [
    { id: 'courses', label: t('courses.title'), icon: BookOpen, path: '/courses', color: 'text-indigo-500' },
    { id: 'astro', label: t('natal.astrology'), icon: Star, path: '/astrology', color: 'text-purple-500' },
    { id: 'hd', label: t('natal.humanDesign'), icon: Sparkles, path: '/human-design', color: 'text-orange-500' },
    { id: 'meditation', label: 'Meditation', icon: Moon, path: '/community', color: 'text-blue-500' },
  ];

  return (
    <section>
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">{t('home.featuredContent')}</h2>
      <div className="grid grid-cols-4 gap-2">
        {items.map((item) => (
          <div 
            key={item.id} 
            onClick={() => navigate(item.path)}
            className="aspect-square bg-white dark:bg-slate-900 rounded-xl flex flex-col items-center justify-center shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <item.icon size={20} className={`${item.color} mb-1`} />
            <span className="text-[10px] font-medium text-slate-600 dark:text-slate-300 text-center leading-tight">{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
