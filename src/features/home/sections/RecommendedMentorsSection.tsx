import React from 'react';
import { useT } from '../../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENTORS } from '../../../services/mockData';

export const RecommendedMentorsSection: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  
  // Just take top 2 for recommendation
  const mentors = MOCK_MENTORS.slice(0, 2);

  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('home.recommendedMentors')}</h2>
        <button onClick={() => navigate('/mentors')} className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">View All</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {mentors.map(mentor => (
          <div 
            key={mentor.id}
            onClick={() => navigate(`/mentors/${mentor.id}`)}
            className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer"
          >
            <div className="flex flex-col items-center text-center">
              <img src={mentor.avatarUrl} className="w-12 h-12 rounded-full mb-2 object-cover" alt={mentor.name} />
              <p className="font-semibold text-xs text-slate-900 dark:text-white truncate w-full">{mentor.name}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full">{mentor.title}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};