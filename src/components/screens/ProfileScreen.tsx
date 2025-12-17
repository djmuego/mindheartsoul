
import React, { useMemo, useEffect, useState } from 'react';
import { Brand } from '../../constants';
import { Settings, ChevronRight, Star, LogOut, BookOpen, Briefcase, Lock, Sparkles, Activity, Sun, Moon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../context/SessionContext';
import { useT } from '../../i18n/useT';
import { getBookingsByUser } from '../../services/bookingsService';
import { getPosts } from '../../services/communityService';
import { applyForMentor } from '../../services/mentorsService';
import { useEntitlements } from '../../hooks/useEntitlements';
import { getBlueprintSnapshot } from '../../services/blueprintService';
import { BlueprintSnapshot } from '../../types';
import { NatalChart } from '../NatalChart';

export const ProfileScreen: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser, birthProfile } = useSession();
  const t = useT();
  const { isPro, features } = useEntitlements();
  
  const [blueprint, setBlueprint] = useState<BlueprintSnapshot | null>(null);

  useEffect(() => {
    if (birthProfile && user) {
      getBlueprintSnapshot(user.id, birthProfile).then(setBlueprint);
    }
  }, [birthProfile, user]);

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  const bookingHistory = useMemo(() => user ? getBookingsByUser(user.id).reverse().slice(0, 5) : [], [user]);
  const postCount = useMemo(() => user ? getPosts().filter(p => p.authorId === user.id).length : 0, [user]);

  const handleApplyMentor = () => {
    if (!user) return;
    if (confirm('Apply to become a mentor?')) {
      applyForMentor(user.id, { name: user.name, avatarUrl: user.avatarDataUrl });
      refreshUser();
      alert(t('mentor.applySuccess'));
    }
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950">
      <div className="bg-white dark:bg-slate-900 p-6 pb-8 rounded-b-3xl shadow-sm transition-colors duration-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className={`text-2xl font-bold text-${Brand.colors.text} dark:text-white`}>{t('profile.title')}</h1>
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 bg-slate-50 dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Settings size={20} className="text-slate-600 dark:text-slate-300" />
          </button>
        </div>

        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-indigo-100 dark:bg-indigo-900/50 mb-4 p-1 overflow-hidden">
               <img 
                 src={user?.avatarDataUrl || "https://picsum.photos/seed/me/200/200"} 
                 className="w-full h-full rounded-full object-cover" 
                 alt="Profile" 
               />
            </div>
            {isPro && (
              <div className="absolute bottom-3 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white dark:border-slate-900">
                PRO
              </div>
            )}
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name || 'Guest User'}</h2>
          <p className="text-slate-500 dark:text-slate-400 capitalize">{user?.role || t('profile.subtitle')}</p>
          
          {!isPro && (
            <button 
              onClick={() => navigate('/pro')}
              className="mt-3 flex items-center space-x-1 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full text-xs font-bold shadow-md hover:scale-105 transition-transform"
            >
              <Sparkles size={12} />
              <span>{t('pro.getPro')}</span>
            </button>
          )}

          <div className="flex space-x-8 mt-6">
            <div className="text-center">
              <span className="block text-xl font-bold text-slate-900 dark:text-white">{bookingHistory.length}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('profile.sessions')}</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-slate-900 dark:text-white">{postCount}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('community.title')}</span>
            </div>
            <div className="text-center">
              <span className="block text-xl font-bold text-slate-900 dark:text-white">108</span>
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide">{t('profile.minutes')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Blueprint Section */}
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{t('blueprint.title')}</h3>
        
        {!birthProfile ? (
          <div className="bg-gradient-to-br from-indigo-900 to-purple-800 rounded-xl p-6 text-white shadow-lg">
             <div className="flex items-center space-x-4 mb-4">
               <div className="bg-white/20 p-3 rounded-full"><Sparkles size={24} /></div>
               <h4 className="font-bold text-lg">{t('blueprint.ctaTitle')}</h4>
             </div>
             <p className="text-white/80 text-sm mb-4">{t('blueprint.ctaBody')}</p>
             <button onClick={() => navigate('/settings')} className="px-4 py-2 bg-white text-indigo-900 rounded-full font-bold text-sm">
               {t('common.addBirthData')}
             </button>
          </div>
        ) : (
          <div className="space-y-4">
             {/* Human Design Card */}
             {features.humanDesignEnabled && blueprint?.humanDesign && (
               <div className="bg-slate-800 text-white rounded-xl p-5 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Activity size={80} /></div>
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-4">
                       <h4 className="font-bold text-lg">{t('hd.title')}</h4>
                       <span className="text-xs bg-white/20 px-2 py-1 rounded">{blueprint.humanDesign.profile}</span>
                     </div>
                     <div className="space-y-2 mb-4">
                        <div>
                          <span className="text-xs text-white/60 uppercase">{t('blueprint.labelType')}</span>
                          <p className="font-semibold">{blueprint.humanDesign.type}</p>
                        </div>
                        <div className="flex space-x-4">
                           <div>
                             <span className="text-xs text-white/60 uppercase">{t('blueprint.labelStrategy')}</span>
                             <p className="font-medium text-sm">{blueprint.humanDesign.strategy}</p>
                           </div>
                           <div>
                             <span className="text-xs text-white/60 uppercase">{t('blueprint.labelAuthority')}</span>
                             <p className="font-medium text-sm">{blueprint.humanDesign.authority}</p>
                           </div>
                        </div>
                     </div>
                     <button onClick={() => navigate('/human-design')} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                       {t('blueprint.openHD')}
                     </button>
                  </div>
               </div>
             )}

             {/* Astrology Card */}
             {features.astrologyEnabled && blueprint?.astrology && (
               <div className="bg-indigo-900 text-white rounded-xl p-5 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Star size={80} /></div>
                  <div className="relative z-10">
                     <h4 className="font-bold text-lg mb-4">{t('astrology.title')}</h4>
                     <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                        <div className="bg-white/10 rounded-lg p-2">
                           <Sun size={16} className="mx-auto mb-1 text-yellow-300" />
                           <p className="font-bold text-sm">{blueprint.astrology.sunSign}</p>
                           <span className="text-[10px] text-white/60">{t('blueprint.labelSun')}</span>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2">
                           <Moon size={16} className="mx-auto mb-1 text-slate-300" />
                           <p className="font-bold text-sm">{blueprint.astrology.moonSign}</p>
                           <span className="text-[10px] text-white/60">{t('blueprint.labelMoon')}</span>
                        </div>
                        <div className="bg-white/10 rounded-lg p-2">
                           <Star size={16} className="mx-auto mb-1 text-orange-300" />
                           <p className="font-bold text-sm">{blueprint.astrology.risingSign}</p>
                           <span className="text-[10px] text-white/60">{t('blueprint.labelRising')}</span>
                        </div>
                     </div>
                     <button onClick={() => navigate('/astrology')} className="w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-bold transition-colors">
                       {t('blueprint.openAstro')}
                     </button>
                  </div>
               </div>
             )}

             {/* Natal Chart Preview */}
             {features.astrologyEnabled && blueprint?.astrology?.planetDegrees && (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm text-center">
                   <div className="pointer-events-none transform scale-75 -my-8">
                      <NatalChart degrees={blueprint.astrology.planetDegrees} size={300} />
                   </div>
                   <button 
                     onClick={() => navigate('/natal')}
                     className="mt-2 w-full py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors"
                   >
                     {t('blueprint.openNatal')}
                   </button>
                </div>
             )}
          </div>
        )}

        {/* Existing Actions */}
        {user?.role === 'user' && (
           <button onClick={handleApplyMentor} className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl shadow-md text-white mt-6">
              <div className="flex items-center space-x-4">
                 <div className="p-2 rounded-lg bg-white/20"><Briefcase size={20} /></div>
                 <span className="font-bold">{t('profile.applyMentor')}</span>
              </div>
              <ChevronRight size={18} />
           </button>
        )}
        {user?.role === 'mentor' && (
           <button onClick={() => navigate('/mentor')} className="w-full flex items-center justify-between p-4 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-sm mt-6">
              <div className="flex items-center space-x-4">
                 <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-300"><Briefcase size={20} /></div>
                 <span className="font-bold text-indigo-900 dark:text-indigo-100">{t('profile.mentorPanel')}</span>
              </div>
              <ChevronRight size={18} className="text-indigo-400" />
           </button>
        )}
        {user?.role === 'admin' && (
           <button onClick={() => navigate('/admin')} className="w-full flex items-center justify-between p-4 bg-slate-800 text-white rounded-xl shadow-sm mt-6">
              <div className="flex items-center space-x-4">
                 <div className="p-2 rounded-lg bg-white/20"><Lock size={20} /></div>
                 <span className="font-bold">{t('profile.adminPanel')}</span>
              </div>
              <ChevronRight size={18} />
           </button>
        )}

        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 mt-4">{t('profile.account')}</h3>
        <button onClick={() => navigate('/courses')} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent dark:border-slate-800">
           <div className="flex items-center space-x-4">
              <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500"><BookOpen size={20} /></div>
              <span className="font-medium text-slate-700 dark:text-slate-200">{t('courses.title')}</span>
           </div>
           <ChevronRight size={18} className="text-slate-300 dark:text-slate-600" />
        </button>
        
        <button onClick={handleLogout} className="w-full flex items-center justify-between p-4 bg-white dark:bg-slate-900 rounded-xl shadow-sm hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors border border-transparent dark:border-slate-800 mt-6">
          <div className="flex items-center space-x-4">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500"><LogOut size={20} /></div>
            <span className="font-medium text-red-600 dark:text-red-400">{t('profile.logout')}</span>
          </div>
        </button>
      </div>
    </div>
  );
};
