
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brand } from '../../constants';
import { ChevronLeft, Check, Sparkles } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { useEntitlements } from '../../hooks/useEntitlements';

export const ProScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { isPro } = useEntitlements();

  const handleUpgrade = () => {
    // Navigate to payment screen
    navigate('/payment?purpose=pro_subscription&amount=9.99');
  };

  return (
    <div className="min-h-full bg-slate-900 text-white flex flex-col">
      <div className="p-4 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 -ml-2 rounded-full hover:bg-white/10"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className="flex-1 p-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
          <Sparkles size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{t('pro.title')}</h1>
        <p className="text-slate-400 mb-8">{t('pro.subtitle')}</p>

        <div className="w-full max-w-sm bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
          <div className="text-center mb-6">
            <div className="text-4xl font-bold mb-2">$9.99</div>
            <div className="text-sm text-slate-400">Lifetime Access</div>
          </div>
          <ul className="space-y-4 text-left">
            {[
              'Unlimited AI Guide Chat',
              'Access Pro Courses',
              'Advanced Natal Insights',
              'Priority Mentor Booking',
              'Human Design Full Report',
              'Astrology Deep Dive'
            ].map((benefit, i) => (
              <li key={i} className="flex items-center space-x-3">
                <div className="bg-green-500/20 text-green-400 p-1 rounded-full">
                  <Check size={14} />
                </div>
                <span className="text-sm font-medium">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>

        {isPro ? (
          <div className="px-6 py-3 bg-green-500/20 text-green-400 rounded-full font-bold border border-green-500/50">
            {t('pro.active')}
          </div>
        ) : (
          <button
            onClick={handleUpgrade}
            className={`w-full max-w-xs py-4 bg-gradient-to-r from-${Brand.colors.primary} to-${Brand.colors.secondary} rounded-xl font-bold text-lg shadow-xl hover:opacity-90 transition-opacity`}
          >
            {t('pro.upgrade')}
          </button>
        )}
        
        <p className="text-xs text-slate-500 mt-6">
          Recurring billing. Cancel anytime.
        </p>
      </div>
    </div>
  );
};
