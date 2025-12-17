import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Star, Globe, Clock } from 'lucide-react';
import { getMentorById } from '../../services/mockData';
import { useLanguage } from '../../context/LanguageContext';

export const MentorProfileScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  const mentor = getMentorById(id || '');

  if (!mentor) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md text-center shadow-lg">
          <div className="text-6xl mb-4">🤷</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Mentor Not Found
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            This mentor profile doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/mentors')}
            className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-bold transition-colors"
          >
            Back to Mentors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white truncate">{mentor.name}</h1>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* Profile Card */}
        <div className="bg-white dark:bg-slate-900 p-6 pb-8 border-b border-slate-100 dark:border-slate-800">
           <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-tr from-indigo-400 to-purple-400 mb-4">
                <img src={mentor.avatarUrl} className="w-full h-full rounded-full object-cover bg-white dark:bg-slate-800" alt={mentor.name} />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{mentor.name}</h2>
              <p className="text-indigo-600 dark:text-indigo-400 font-medium">{mentor.title}</p>
              
              <div className="flex items-center space-x-4 mt-4 text-sm text-slate-500 dark:text-slate-400">
                 <div className="flex items-center space-x-1">
                   <Star size={16} className="text-yellow-500 fill-current" />
                   <span className="font-semibold text-slate-700 dark:text-slate-300">4.9</span>
                   <span>(120)</span>
                 </div>
                 <div className="flex items-center space-x-1">
                    <Globe size={16} />
                    <span>{mentor.languages.join(', ')}</span>
                 </div>
              </div>
           </div>

           <div className="mt-6">
             <h3 className="font-semibold text-slate-900 dark:text-white mb-2">About</h3>
             <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">
               {mentor.bio}
             </p>
           </div>
           
           <div className="mt-4 flex flex-wrap gap-2">
             {mentor.tags.map(tag => (
               <span key={tag} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                 {tag}
               </span>
             ))}
           </div>
        </div>

        {/* Services */}
        <div className="p-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-4">Available Sessions</h3>
          <div className="space-y-4">
             {mentor.sessionTypes.map(session => (
               <div key={session.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-sm">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-semibold text-slate-900 dark:text-white">{session.label}</h4>
                   <span className="font-bold text-slate-900 dark:text-white">${session.price}</span>
                 </div>
                 <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                   <Clock size={16} className="mr-1" />
                   <span>{session.durationMin} mins</span>
                 </div>
                 <button 
                   onClick={() => navigate(`/book/${mentor.id}?type=${session.id}`)}
                   className={`w-full py-2.5 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-colors`}
                 >
                   {t('common.book')}
                 </button>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
};