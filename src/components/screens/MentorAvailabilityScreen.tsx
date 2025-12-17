
import React from 'react';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Brand } from '../../constants';

export const MentorAvailabilityScreen: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('mentor.availability')}</h1>
      </div>

      <div className="p-6 text-center">
        <p className="text-slate-500 mb-4">Availability management stub.</p>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left">
           <h3 className="font-bold mb-2 text-slate-900 dark:text-white">Standard Weekly</h3>
           <p className="text-sm text-slate-600 dark:text-slate-400">Mon - Fri: 09:00 - 17:00</p>
           <button className={`mt-4 px-4 py-2 bg-${Brand.colors.primary} text-white rounded-lg text-sm`}>Edit (Mock)</button>
        </div>
      </div>
    </div>
  );
};
