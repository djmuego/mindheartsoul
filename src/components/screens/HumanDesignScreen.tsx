
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Hexagon, Info } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { useSession } from '../../context/SessionContext';
import { humanDesignEngineMock } from '../../features/humanDesign/engine/humanDesignEngineMock';
import { HumanDesignProfile } from '../../features/humanDesign/engine/types';
import { BodygraphChartPro } from '../humanDesign/BodygraphChartPro';
import { ProfileSidePanels } from '../humanDesign/ProfileSidePanels';
import { CenterDescriptions } from '../humanDesign/CenterDescriptions';

export const HumanDesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { birthProfile, session } = useSession();
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
    <div className="min-h-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex flex-col">
      {/* Header */}
      <div className="bg-slate-900/80 backdrop-blur-sm p-4 shadow-lg border-b border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-800 text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-white flex-1">{t('hd.title')}</h1>
        <button
          onClick={() => setShowDescriptions(!showDescriptions)}
          className={`p-2 rounded-full transition-colors ${
            showDescriptions 
              ? 'bg-indigo-600 text-white' 
              : 'hover:bg-slate-800 text-slate-400'
          }`}
        >
          <Info size={20} />
        </button>
      </div>

      <div className="p-6 space-y-6 pb-24">
        {/* Profile Side Panels */}
        <ProfileSidePanels profile={profile} userName={session.userName} />

        {/* Bodygraph Chart - Full Width */}
        <div className="bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden backdrop-blur-sm">
          <div className="p-4 border-b border-slate-800 bg-slate-900/80">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white">Бодиграф</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Карта вашей энергетической системы
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1.5 bg-slate-800/50 rounded-lg px-3 py-1.5">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-xs text-slate-300">Определено</span>
                </div>
                <div className="flex items-center space-x-1.5 bg-slate-800/50 rounded-lg px-3 py-1.5">
                  <div className="w-2 h-2 bg-slate-500 rounded-full"></div>
                  <span className="text-xs text-slate-300">Открыто</span>
                </div>
              </div>
            </div>
          </div>
          <div className="p-6">
            <BodygraphChartPro 
              centers={profile.centers} 
              type={profile.type}
              gates={[64, 47, 17, 62, 20, 34, 10, 25, 51]}
            />
          </div>
        </div>

        {/* Center Descriptions (toggleable) */}
        {showDescriptions && (
          <div className="bg-slate-900/50 rounded-2xl border border-slate-800 shadow-2xl p-6 backdrop-blur-sm">
            <CenterDescriptions centers={profile.centers} />
          </div>
        )}

        {/* Centers Quick View */}
        {!showDescriptions && (
          <div className="bg-slate-900/50 rounded-xl p-6 border border-slate-800 shadow-lg backdrop-blur-sm">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-bold text-white">Обзор Центров</h3>
               <button
                 onClick={() => setShowDescriptions(true)}
                 className="text-sm text-indigo-400 font-medium hover:text-indigo-300 transition-colors"
               >
                 Показать Детали
               </button>
             </div>
             <div className="grid grid-cols-3 gap-3">
                {Object.entries(profile.centers).map(([center, defined]) => (
                  <div 
                    key={center} 
                    className={`p-4 rounded-xl text-xs font-bold capitalize transition-all ${
                      defined 
                        ? 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg' 
                        : 'bg-slate-800 text-slate-500 border border-slate-700'
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
