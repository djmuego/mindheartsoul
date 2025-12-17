
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Star, Sun, Moon } from 'lucide-react';
// import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';
import { useSession } from '../../context/SessionContext';
import { astrologyEngineMock } from '../../features/astrology/engine/astrologyEngineMock';
import { AstrologyProfile } from '../../features/astrology/engine/types';

export const AstrologyScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { birthProfile } = useSession();
  const [profile, setProfile] = useState<AstrologyProfile | null>(null);

  useEffect(() => {
    if (birthProfile) {
      astrologyEngineMock.calculateProfile(birthProfile).then(setProfile);
    }
  }, [birthProfile]);

  if (!birthProfile) return <div className="p-8">Please setup birth profile.</div>;
  if (!profile) return <div className="p-8">Loading charts...</div>;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('astrology.title')}</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-indigo-900 to-purple-800 text-white rounded-2xl p-6 shadow-lg">
           <div className="flex items-center space-x-4 mb-4">
             <div className="bg-white/20 p-3 rounded-full">
               <Sun size={24} />
             </div>
             <div>
               <p className="text-white/60 text-xs uppercase tracking-wider">Sun Sign</p>
               <h2 className="text-2xl font-bold">{profile.sunSign}</h2>
             </div>
           </div>
           <p className="opacity-90 text-sm leading-relaxed">
             {profile.summary}
           </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2 mb-1">
                <Moon size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">Moon</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{profile.moonSign}</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2 mb-1">
                <Star size={16} className="text-slate-400" />
                <span className="text-xs font-bold text-slate-500 uppercase">Rising</span>
              </div>
              <p className="text-lg font-bold text-slate-900 dark:text-white">{profile.risingSign}</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
           <div className="p-4 bg-slate-50 dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
             <h3 className="font-bold text-slate-900 dark:text-white">Planetary Placements</h3>
           </div>
           <div className="divide-y divide-slate-100 dark:divide-slate-800">
             {profile.chartPoints.map((point) => (
               <div key={point.key} className="p-4 flex justify-between items-center">
                 <span className="text-slate-600 dark:text-slate-300 font-medium capitalize">{point.key}</span>
                 <div className="flex items-center space-x-2">
                   <span className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-bold">
                     {point.sign}
                   </span>
                   <span className="text-slate-400 text-xs font-mono">
                     {Math.floor(point.degree % 30)}°
                   </span>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </div>
  );
};
