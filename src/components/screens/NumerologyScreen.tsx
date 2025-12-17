import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Calculator, Sparkles } from 'lucide-react';
import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';
import { useSession } from '../../context/SessionContext';

export const NumerologyScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { birthProfile } = useSession();

  if (!birthProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className={`p-4 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-6`}>
          <Calculator size={48} className={`text-${Brand.colors.primary} dark:text-blue-400`} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('natal.emptyTitle')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
          {t('natal.emptyDesc')}
        </p>
        <button
          onClick={() => navigate('/settings')}
          className={`px-6 py-3 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-lg`}
        >
          {t('common.addBirthData')}
        </button>
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
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('numerology.title')}</h1>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="inline-flex p-6 rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
            <Sparkles size={64} className="text-blue-600 dark:text-blue-400" />
          </div>
          
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            {t('numerology.title')}
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            {t('numerology.desc')}
          </p>
          
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 mb-6">
            <div className="flex items-center space-x-3 mb-4">
              <Calculator className="text-blue-600 dark:text-blue-400" size={24} />
              <h3 className="font-semibold text-slate-900 dark:text-white text-left">Coming Soon</h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-left">
              {t('numerology.comingSoon')}
            </p>
          </div>

          <div className="space-y-3 text-sm text-slate-500 dark:text-slate-400">
            <p>🔢 Life Path Number</p>
            <p>✨ Expression Number</p>
            <p>💫 Soul Urge Number</p>
            <p>🎯 Destiny Number</p>
          </div>
        </div>
      </div>
    </div>
  );
};
