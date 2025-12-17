
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Hexagon, Zap, Shield } from 'lucide-react';
import { Brand } from '../../constants';
import { useT } from '../../i18n/useT';
import { useSession } from '../../context/SessionContext';
import { humanDesignEngineMock } from '../../features/humanDesign/engine/humanDesignEngineMock';
import { HumanDesignProfile } from '../../features/humanDesign/engine/types';

export const HumanDesignScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { birthProfile } = useSession();
  const [profile, setProfile] = useState<HumanDesignProfile | null>(null);

  useEffect(() => {
    if (birthProfile) {
      humanDesignEngineMock.calculateProfile(birthProfile).then(setProfile);
    }
  }, [birthProfile]);

  if (!birthProfile) return <div className="p-8">Please setup birth profile.</div>;
  if (!profile) return <div className="p-8">Loading chart...</div>;

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('hd.title')}</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-slate-800 text-white rounded-2xl p-6 shadow-lg relative overflow-hidden">
           <Hexagon className="absolute -top-4 -right-4 text-white/10" size={120} />
           <div className="relative z-10">
             <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Energy Type</p>
             <h2 className="text-2xl font-bold text-white mb-2">{profile.type}</h2>
             <div className="flex space-x-2">
                <span className="px-2 py-1 bg-white/20 rounded text-xs">{profile.authority} Authority</span>
                <span className="px-2 py-1 bg-white/20 rounded text-xs">{profile.profile} Profile</span>
             </div>
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2 mb-2 text-indigo-600 dark:text-indigo-400">
                <Zap size={18} />
                <span className="font-bold text-sm">Strategy</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{profile.strategy}</p>
           </div>
           <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center space-x-2 mb-2 text-red-500">
                <Shield size={18} />
                <span className="font-bold text-sm">Theme</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300">{profile.theme}</p>
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800">
           <h3 className="font-bold text-slate-900 dark:text-white mb-4">Centers</h3>
           <div className="grid grid-cols-3 gap-2 text-center">
              {Object.entries(profile.centers).map(([center, defined]) => (
                <div key={center} className={`p-2 rounded text-xs font-bold capitalize ${defined ? `bg-${Brand.colors.primary} text-white` : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                  {center}
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};
