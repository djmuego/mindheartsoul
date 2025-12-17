import React, { useState } from 'react';
import { Brand } from '../../constants';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MOCK_MENTORS } from '../../services/mockData';
import { useT } from '../../i18n/useT';

export const MentorsScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Mindfulness', 'Astrology', 'Career', 'Healing'];

  const filteredMentors = MOCK_MENTORS.filter(mentor => {
    const matchesSearch = mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          mentor.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = activeFilter === 'All' || mentor.tags.includes(activeFilter);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 min-h-full bg-white dark:bg-slate-900 transition-colors duration-200">
      <div className="sticky top-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm pb-4 z-10">
        <h1 className={`text-2xl font-bold text-${Brand.colors.text} dark:text-white mb-4`}>{t('mentors.title')}</h1>
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('mentors.search')} 
            className="w-full pl-10 pr-4 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
          />
        </div>
        
        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-2">
           {filters.map(filter => (
             <button
               key={filter}
               onClick={() => setActiveFilter(filter)}
               className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
                 ${activeFilter === filter 
                   ? `bg-${Brand.colors.primary} text-white` 
                   : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                 }`}
             >
               {filter}
             </button>
           ))}
        </div>
      </div>

      <div className="space-y-4 pb-20">
        {filteredMentors.map((mentor) => (
          <div 
            key={mentor.id} 
            onClick={() => navigate(`/mentors/${mentor.id}`)}
            className="flex items-start space-x-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md dark:hover:bg-slate-800/50 cursor-pointer transition-all"
          >
            <img 
              src={mentor.avatarUrl} 
              alt={mentor.name} 
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-900 dark:text-white truncate pr-2">{mentor.name}</h3>
                <span className="text-xs font-semibold bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                  ${mentor.priceFrom}+
                </span>
              </div>
              <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium truncate">{mentor.title}</p>
              
              <div className="flex flex-wrap gap-1 mt-2">
                {mentor.tags.slice(0, 3).map(tag => (
                   <span key={tag} className="text-[10px] bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-md">
                     {tag}
                   </span>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        {filteredMentors.length === 0 && (
          <div className="text-center py-12 text-slate-400 dark:text-slate-500">
            No mentors found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};