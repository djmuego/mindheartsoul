
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Hexagon } from 'lucide-react';
import { useT } from '../../i18n/useT';

export const HumanDesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();

  return (
    <div className="min-h-full bg-white dark:bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-200 dark:border-slate-800 flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('hd.title')}</h1>
      </div>

      {/* Placeholder Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-full">
              <Hexagon className="text-indigo-600 dark:text-indigo-400" size={64} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
            Human Design
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {t('common.comingSoon') || 'Coming Soon'}
          </p>
          <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              This section is under development. Stay tuned for your personalized Human Design chart and insights.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
