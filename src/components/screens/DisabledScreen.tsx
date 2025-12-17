import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Ban } from 'lucide-react';
import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';

export const DisabledScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();

  return (
    <div className="min-h-full bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 fixed top-0 left-0 right-0 z-20">
        <button 
          onClick={() => navigate('/home')} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('disabled.title')}</h1>
      </div>

      <div className="mt-20 max-w-md">
        <div className={`p-6 rounded-full bg-slate-100 dark:bg-slate-800 mb-6 inline-flex`}>
          <Ban size={64} className="text-slate-400" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {t('disabled.heading')}
        </h2>
        
        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
          {t('disabled.message')}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/mentors')}
            className={`w-full py-3 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors`}
          >
            {t('disabled.findMentor')}
          </button>
          
          <button
            onClick={() => navigate('/chat')}
            className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-semibold transition-colors"
          >
            {t('disabled.openChat')}
          </button>
          
          <button
            onClick={() => navigate('/home')}
            className="w-full py-3 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 font-medium"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    </div>
  );
};
