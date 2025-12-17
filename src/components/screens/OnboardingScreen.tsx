import React, { useState, useEffect } from 'react';
import { Brand } from '../../constants';
import { useSession } from '../../context/SessionContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BirthProfile } from '../../types';

export const OnboardingScreen: React.FC = () => {
  const { setBirthProfile, birthProfile } = useSession();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<Partial<BirthProfile>>({
    fullName: '',
    birthDate: '',
    birthTime: '',
    birthCity: ''
  });

  // Pre-fill if editing or if data exists
  useEffect(() => {
    if (birthProfile) {
      setFormData(birthProfile);
    }
  }, [birthProfile]);

  const isValid = formData.birthDate && formData.birthTime && formData.birthCity && formData.fullName;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const newProfile: BirthProfile = {
      fullName: formData.fullName || '',
      birthDate: formData.birthDate || '',
      birthTime: formData.birthTime || '12:00',
      birthCity: formData.birthCity || '',
      tzOffsetMinutes: new Date().getTimezoneOffset(),
      savedAt: new Date().toISOString()
    };
    
    setBirthProfile(newProfile);
    navigate('/home');
  };

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 bg-${Brand.colors.background} dark:bg-slate-950 transition-colors duration-200`}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
           <div className={`w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4`}>
             <Sparkles size={32} className={`text-${Brand.colors.primary} dark:text-indigo-400`} />
           </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Setup Your Profile</h1>
          <p className="text-slate-500 dark:text-slate-400">
            We use your birth details to generate your unique natal chart and insights.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={e => setFormData({...formData, fullName: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                placeholder="Your Name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
              <input
                type="date"
                required
                value={formData.birthDate}
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
              />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={formData.birthTime}
                  onChange={e => setFormData({...formData, birthTime: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                />
              </div>
              <div className="flex-1">
                 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">City of Birth</label>
                 <input 
                   type="text"
                   required 
                   placeholder="City, Country"
                   value={formData.birthCity}
                   onChange={(e) => setFormData({...formData, birthCity: e.target.value})}
                   className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors"
                 />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!isValid}
                className={`w-full py-3 flex items-center justify-center space-x-2 bg-${Brand.colors.primary} hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-200 dark:shadow-none`}
              >
                <span>{birthProfile ? 'Update Profile' : 'Complete Setup'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        </div>
        
        {birthProfile && (
           <div className="mt-6 text-center">
             <button 
               onClick={() => navigate('/home')}
               className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-sm font-medium"
             >
               Skip for now
             </button>
           </div>
        )}
      </div>
    </div>
  );
};