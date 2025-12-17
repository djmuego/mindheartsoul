
import React, { useState, useEffect } from 'react';
import { Brand } from '../../constants';
import { useTheme } from '../../context/ThemeContext';
import { useSession } from '../../context/SessionContext';
import { useI18n } from '../../i18n/useT';
import { ChevronLeft, Moon, Sun, Monitor, Globe, Edit3, Save, Star, ToggleLeft, ToggleRight, Database, Download, Upload, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ThemeMode, BirthProfile, FeatureFlagKey } from '../../types';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useEntitlements } from '../../hooks/useEntitlements';
import { storage, STORAGE_KEYS } from '../../services/storage';
import { invalidateBlueprint } from '../../services/blueprintService';

export const SettingsScreen: React.FC = () => {
  const { themeMode, setThemeMode } = useTheme();
  const { birthProfile, setBirthProfile, user } = useSession();
  const { lang, setLang, t, availableLocales } = useI18n();
  const { flags, setFlag, resetFlags } = useFeatureFlags();
  const { isPro } = useEntitlements();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<BirthProfile>>({
    birthDate: '',
    birthTime: '',
    birthCity: ''
  });

  useEffect(() => {
    if (birthProfile) {
      setFormData(birthProfile);
    }
  }, [birthProfile]);

  const handleSaveBirthData = () => {
    if (!formData.birthDate) return;
    const newProfile: BirthProfile = {
      fullName: formData.fullName || 'User',
      birthDate: formData.birthDate,
      birthTime: formData.birthTime || '12:00',
      birthCity: formData.birthCity || 'Unknown',
      tzOffsetMinutes: new Date().getTimezoneOffset(),
      savedAt: new Date().toISOString()
    };
    setBirthProfile(newProfile);
    invalidateBlueprint(); // Force refresh of Blueprint on profile
    navigate('/profile'); // Redirect to profile to see changes
  };

  const handleExportData = () => {
    const data: Record<string, any> = {};
    Object.values(STORAGE_KEYS).forEach(key => {
      data[key] = storage.getJSON(key, null);
    });
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mhs-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        Object.entries(data).forEach(([key, value]) => {
          if (Object.values(STORAGE_KEYS).includes(key)) {
            storage.setJSON(key, value);
          }
        });
        alert('Data imported successfully. Reloading...');
        window.location.reload();
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    if (confirm('Are you sure? This will delete all local data (except preferences).')) {
      const preserve = [STORAGE_KEYS.THEME, STORAGE_KEYS.LANG];
      Object.values(STORAGE_KEYS).forEach(key => {
        if (!preserve.includes(key)) {
          storage.remove(key);
        }
      });
      alert('Data reset. Reloading...');
      window.location.reload();
    }
  };

  const ThemeOption = ({ mode, icon: Icon, label }: { mode: ThemeMode; icon: any; label: string }) => {
    const isSelected = themeMode === mode;
    return (
      <button
        onClick={() => setThemeMode(mode)}
        className={`flex items-center justify-between w-full p-4 rounded-xl border transition-all duration-200 
          ${isSelected 
            ? `border-${Brand.colors.primary} bg-indigo-50 dark:bg-indigo-900/20` 
            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
          }`}
      >
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${isSelected ? 'bg-indigo-100 dark:bg-indigo-800 text-indigo-600 dark:text-indigo-200' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'}`}>
            <Icon size={20} />
          </div>
          <span className={`font-medium ${isSelected ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'}`}>
            {label}
          </span>
        </div>
        {isSelected && (
          <div className={`w-4 h-4 rounded-full border-[5px] border-${Brand.colors.primary}`} />
        )}
      </button>
    );
  };

  return (
    <div className="min-h-full bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-200">
      <div className="bg-white dark:bg-slate-900 p-4 shadow-sm border-b border-slate-100 dark:border-slate-800 flex items-center space-x-4 sticky top-0 z-20">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t('settings.title')}</h1>
      </div>

      <div className="p-6 space-y-8 pb-24">
        
        {/* Pro Status */}
        <section onClick={() => navigate('/pro')} className="cursor-pointer">
           <div className={`bg-gradient-to-r ${isPro ? 'from-green-500 to-emerald-600' : `from-${Brand.colors.primary} to-${Brand.colors.secondary}`} rounded-2xl p-4 text-white shadow-lg`}>
              <div className="flex justify-between items-center">
                 <div>
                   <h2 className="font-bold text-lg">{isPro ? 'PRO Member' : t('pro.title')}</h2>
                   <p className="opacity-90 text-sm">{isPro ? 'Subscription Active' : t('pro.subtitle')}</p>
                 </div>
                 <div className="bg-white/20 p-2 rounded-full">
                   <Star fill="currentColor" size={24} />
                 </div>
              </div>
           </div>
        </section>

        {/* Admin / Feature Flags & Maintenance */}
        {user?.role === 'admin' && (
          <section>
            <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">Admin Controls</h2>
            
            {/* Maintenance */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
               <div className="p-4 border-b border-slate-100 dark:border-slate-800 font-medium text-slate-900 dark:text-white flex items-center">
                 <Database size={18} className="mr-2 text-indigo-500" />
                 Maintenance
               </div>
               <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-700">
                  <button onClick={handleExportData} className="p-4 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Download size={20} className="mb-2 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs">Export</span>
                  </button>
                  <label className="p-4 flex flex-col items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 cursor-pointer">
                    <Upload size={20} className="mb-2 text-slate-600 dark:text-slate-300" />
                    <span className="text-xs">Import</span>
                    <input type="file" onChange={handleImportData} className="hidden" accept=".json" />
                  </label>
                  <button onClick={handleResetData} className="p-4 flex flex-col items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500">
                    <Trash2 size={20} className="mb-2" />
                    <span className="text-xs">Reset</span>
                  </button>
               </div>
            </div>

            {/* Feature Flags */}
            <h3 className="text-xs font-semibold text-slate-400 uppercase mb-2">Feature Flags</h3>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
               {Object.entries(flags).map(([key, enabled]) => (
                 <div key={key} className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{key}</span>
                    <button 
                      onClick={() => setFlag(key as FeatureFlagKey, !enabled)}
                      className={`text-2xl transition-colors ${enabled ? 'text-green-500' : 'text-slate-400'}`}
                    >
                      {enabled ? <ToggleRight /> : <ToggleLeft />}
                    </button>
                 </div>
               ))}
               <button onClick={resetFlags} className="w-full p-3 text-center text-red-500 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-700">
                 Reset Flags
               </button>
            </div>
          </section>
        )}

        {/* Language */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{t('settings.language')}</h2>
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-2 border border-slate-200 dark:border-slate-700">
             <div className="flex items-center px-3 py-2 space-x-3">
               <Globe className="text-slate-400" size={20} />
               <select 
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                className="w-full p-2 bg-transparent text-slate-900 dark:text-white outline-none"
               >
                 {availableLocales.map(l => (
                   <option key={l.code} value={l.code} className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                     {l.nativeName}
                   </option>
                 ))}
               </select>
             </div>
          </div>
        </section>

        {/* Birth Data */}
        <section>
           <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{t('settings.birthProfile')}</h2>
           <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-200 dark:border-slate-700 space-y-4">
             {birthProfile ? (
               <div className="flex justify-between items-center mb-2">
                 <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{birthProfile.fullName || 'User'}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{birthProfile.birthDate} • {birthProfile.birthCity}</p>
                 </div>
                 <button 
                     onClick={() => navigate('/onboarding')}
                     className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                   >
                     <Edit3 size={20} />
                 </button>
               </div>
             ) : null}

             {!birthProfile && (
               <>
               <div>
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                 <input 
                   type="date" 
                   value={formData.birthDate}
                   onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                   className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                 />
               </div>
               <div className="flex space-x-4">
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                   <input 
                     type="time" 
                     value={formData.birthTime}
                     onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
                     className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                   />
                 </div>
                 <div className="flex-1">
                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City</label>
                   <input 
                     type="text" 
                     placeholder="City"
                     value={formData.birthCity}
                     onChange={(e) => setFormData({...formData, birthCity: e.target.value})}
                     className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                   />
                 </div>
               </div>
               <button 
                 onClick={handleSaveBirthData}
                 className={`w-full py-3 mt-2 flex items-center justify-center space-x-2 bg-${Brand.colors.primary} hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors`}
               >
                 <Save size={18} />
                 <span>{t('settings.save')}</span>
               </button>
               </>
             )}
           </div>
        </section>
        
        {/* Appearance */}
        <section>
          <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4">{t('settings.appearance')}</h2>
          <div className="space-y-3">
            <ThemeOption mode="system" icon={Monitor} label="System Default" />
            <ThemeOption mode="light" icon={Sun} label="Light Mode" />
            <ThemeOption mode="dark" icon={Moon} label="Dark Mode" />
          </div>
        </section>
      </div>
    </div>
  );
};
