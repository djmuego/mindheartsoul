
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Hexagon, Zap, Shield, Info } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { useSession } from '../../context/SessionContext';
import { humanDesignEngineMock } from '../../features/humanDesign/engine/humanDesignEngineMock';
import { HumanDesignProfile } from '../../features/humanDesign/engine/types';
import { BodygraphChart } from '../humanDesign/BodygraphChart';
import { CenterDescriptions } from '../humanDesign/CenterDescriptions';

export const HumanDesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { birthProfile } = useSession();
  const [profile, setProfile] = useState<HumanDesignProfile | null>(null);
  const [showDescriptions, setShowDescriptions] = useState(false);

  useEffect(() => {
    if (birthProfile) {
      humanDesignEngineMock.calculateProfile(birthProfile).then(setProfile);
    }
  }, [birthProfile]);

  if (!birthProfile) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center">
          <Hexagon className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={64} />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Birth Profile Required
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Please set up your birth profile to see your Human Design chart.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
          >
            Setup Birth Profile
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Calculating your chart...</p>
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
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex-1">{t('hd.title')}</h1>
        <button
          onClick={() => setShowDescriptions(!showDescriptions)}
          className={`p-2 rounded-full transition-colors ${
            showDescriptions 
              ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
          }`}
        >
          <Info size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 pb-24">
        {/* Type Summary Card */}
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
           <Hexagon className="absolute -top-4 -right-4 text-white/10" size={120} />
           <div className="relative z-10">
             <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Your Energy Type</p>
             <h2 className="text-3xl font-bold text-white mb-3">{profile.type}</h2>
             <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                  {profile.authority} Authority
                </span>
                <span className="px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                  {profile.profile} Profile
                </span>
             </div>
           </div>
        </div>

        {/* Strategy & Theme */}
        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2 mb-2 text-indigo-600 dark:text-indigo-400">
                <Zap size={20} />
                <span className="font-bold text-sm">Strategy</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{profile.strategy}</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center space-x-2 mb-2 text-red-500 dark:text-red-400">
                <Shield size={20} />
                <span className="font-bold text-sm">Theme</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium">{profile.theme}</p>
           </div>
        </div>

        {/* Bodygraph Chart */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <h3 className="font-bold text-slate-900 dark:text-white">Your Bodygraph</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Visual map of your energy centers and channels
            </p>
          </div>
          <div className="p-6">
            <BodygraphChart centers={profile.centers} type={profile.type} size="large" />
          </div>
        </div>

        {/* Center Descriptions (toggleable) */}
        {showDescriptions && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6">
            <CenterDescriptions centers={profile.centers} />
          </div>
        )}

        {/* Centers Quick View (when descriptions hidden) */}
        {!showDescriptions && (
          <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-slate-900 dark:text-white">Centers Overview</h3>
               <button
                 onClick={() => setShowDescriptions(true)}
                 className="text-sm text-indigo-600 dark:text-indigo-400 font-medium hover:underline"
               >
                 Show Details
               </button>
             </div>
             <div className="grid grid-cols-3 gap-2 text-center">
                {Object.entries(profile.centers).map(([center, defined]) => (
                  <div 
                    key={center} 
                    className={`p-3 rounded-lg text-xs font-bold capitalize transition-all ${
                      defined 
                        ? `bg-indigo-600 text-white shadow-md` 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {center}
                  </div>
                ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
};
