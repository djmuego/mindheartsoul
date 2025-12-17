import React, { useMemo, useState } from 'react';
import { Brand } from '../../constants';
import { useSession } from '../../context/SessionContext';
import { useT } from '../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, Activity, Calculator, Heart, X } from 'lucide-react';
import { computeMockPlanetDegrees, PLANETS } from '../../services/natalChartMock';
// import { NatalChart } from '../NatalChart'; // Removed: per requirements

export const NatalScreen: React.FC = () => {
  const { birthProfile } = useSession();
  const t = useT();
  const navigate = useNavigate();
  const [showDisabledModal, setShowDisabledModal] = useState(false);
  
  const handleDisabledFeatureClick = () => {
    setShowDisabledModal(true);
  };

  const planetDegrees = useMemo(() => {
    if (!birthProfile) return null;
    const seed = `${birthProfile.birthDate}${birthProfile.birthTime}${birthProfile.birthCity}`;
    return computeMockPlanetDegrees(seed);
  }, [birthProfile]);

  if (!birthProfile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center bg-white dark:bg-slate-900 transition-colors duration-200">
        <div className={`p-4 rounded-full bg-indigo-50 dark:bg-indigo-900/30 mb-6`}>
          <Sparkles size={48} className={`text-${Brand.colors.primary} dark:text-indigo-400`} />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('natal.emptyTitle')}</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-xs">
          {t('natal.emptyDesc')}
        </p>
        <button
          onClick={() => navigate('/settings')}
          className={`flex items-center space-x-2 px-6 py-3 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-full font-medium transition-colors shadow-lg shadow-indigo-200 dark:shadow-none`}
        >
          <span>{t('common.addBirthData')}</span>
          <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="pb-8 bg-white dark:bg-slate-900 min-h-full transition-colors duration-200">
      <div className="p-6 bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800">
        <h1 className={`text-2xl font-bold text-${Brand.colors.text} dark:text-white`}>{t('natal.title')}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          {birthProfile.birthCity} • {birthProfile.birthDate}
        </p>
      </div>

      {/* Removed: NatalChart wheel component per requirements */}

      <div className="px-6 mt-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{t('natal.modules')}</h3>
        <div className="grid grid-cols-2 gap-3">
           <button 
             onClick={handleDisabledFeatureClick}
             className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow"
           >
             <Star className="text-purple-600 dark:text-purple-400" size={24} />
             <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('natal.astrology')}</span>
           </button>
           
           <button 
             onClick={handleDisabledFeatureClick}
             className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow"
           >
             <Calculator className="text-blue-600 dark:text-blue-400" size={24} />
             <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('natal.numerology')}</span>
           </button>
           
           <button 
             onClick={handleDisabledFeatureClick}
             className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow"
           >
             <Heart className="text-green-600 dark:text-green-400" size={24} />
             <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('natal.meditation')}</span>
           </button>
           
           <button 
             onClick={handleDisabledFeatureClick}
             className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800 flex flex-col items-center justify-center space-y-2 hover:shadow-md transition-shadow"
           >
             <Activity className="text-orange-600 dark:text-orange-400" size={24} />
             <span className="font-semibold text-sm text-slate-800 dark:text-slate-200">{t('natal.humanDesign')}</span>
           </button>
        </div>
      </div>
      
      {/* Disabled Feature Modal */}
      {showDisabledModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setShowDisabledModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={24} />
            </button>
            
            <div className="text-center pt-2">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                <Sparkles className="text-slate-400" size={32} />
              </div>
              
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                {t('disabled.heading') || 'Feature Coming Soon'}
              </h2>
              
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                {t('disabled.message') || 'This feature is not available in Chat Consultations mode. Connect with a mentor for personalized guidance.'}
              </p>
              
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => {
                    setShowDisabledModal(false);
                    navigate('/mentors');
                  }}
                  className={`w-full py-3 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-semibold transition-colors`}
                >
                  {t('disabled.findMentor') || 'Find a Mentor'}
                </button>
                
                <button
                  onClick={() => setShowDisabledModal(false)}
                  className="w-full py-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-colors"
                >
                  {t('common.cancel') || 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="px-6">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 mt-8">{t('natal.positions')}</h3>
        <div className="space-y-3">
          {planetDegrees && PLANETS.map((planet) => (
            <div key={planet.key} className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-${Brand.colors.primary} dark:text-indigo-400 font-bold text-xs border border-slate-100 dark:border-slate-600`}>
                  {planet.symbol}
                </div>
                <span className="font-medium text-slate-900 dark:text-slate-200">{planet.label}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-mono text-sm">
                {Math.floor(planetDegrees[planet.key])}°
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};