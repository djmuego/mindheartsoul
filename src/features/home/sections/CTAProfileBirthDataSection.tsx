
import React from 'react';
import { useT } from '../../../i18n/useT';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../context/SessionContext';
import { Sparkles, Briefcase } from 'lucide-react';

export const CTAProfileBirthDataSection: React.FC = () => {
  const t = useT();
  const navigate = useNavigate();
  const { birthProfile, user } = useSession();

  // 1. Priority: Birth Data missing
  if (!birthProfile) {
    return (
      <section className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 text-white/20" size={48} />
        <h2 className="text-lg font-bold mb-1">{t('home.setupProfileTitle')}</h2>
        <p className="text-sm text-white/80 mb-4 max-w-[80%]">{t('home.setupProfileBody')}</p>
        <button 
          onClick={() => navigate('/onboarding')}
          className="px-4 py-2 bg-white text-indigo-900 rounded-full text-sm font-bold"
        >
          {t('home.setupProfileBtn')}
        </button>
      </section>
    );
  }

  // 2. Secondary: Mentor CTA if seeker
  if (user?.role === 'seeker') {
    return (
      <section className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <Briefcase className="absolute top-4 right-4 text-white/20" size={48} />
        <h2 className="text-lg font-bold mb-1">{t('home.applyMentorTitle')}</h2>
        <p className="text-sm text-white/80 mb-4 max-w-[80%]">{t('home.applyMentorBody')}</p>
        <button 
          onClick={() => navigate('/profile')}
          className="px-4 py-2 bg-white text-indigo-700 rounded-full text-sm font-bold"
        >
          {t('home.applyMentorBtn')}
        </button>
      </section>
    );
  }

  // 3. Mentor Dashboard link
  if (user?.role === 'mentor') {
    return (
      <section className="bg-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <Briefcase className="absolute top-4 right-4 text-white/10" size={48} />
        <h2 className="text-lg font-bold mb-1">{t('home.mentorDashTitle')}</h2>
        <p className="text-sm text-slate-300 mb-4">{t('home.mentorDashBody')}</p>
        <button 
          onClick={() => navigate('/mentor')}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full text-sm font-bold transition-colors"
        >
          {t('home.mentorDashBtn')}
        </button>
      </section>
    );
  }

  return null;
};
