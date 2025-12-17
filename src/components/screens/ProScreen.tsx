
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Check, Sparkles, Calendar, Clock } from 'lucide-react';
import { useT } from '../../i18n/useT';
import { useEntitlements } from '../../hooks/useEntitlements';
import { SubscriptionPlan } from '../../types';

export const ProScreen: React.FC = () => {
  const navigate = useNavigate();
  const t = useT();
  const { isPro, subscription } = useEntitlements();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('pro_monthly');

  const plans = {
    pro_monthly: {
      price: 9.99,
      duration: t('pro.monthly') || 'per month',
      savings: null
    },
    pro_yearly: {
      price: 99.99,
      duration: t('pro.yearly') || 'per year',
      savings: 17 // 17% discount
    }
  };

  const handleUpgrade = () => {
    const amount = plans[selectedPlan].price;
    navigate(`/payment?purpose=pro_subscription&amount=${amount}&plan=${selectedPlan}`);
  };
  
  // Format expiry date if user has active subscription
  const formatExpiryDate = (isoDate: string) => {
    return new Date(isoDate).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

      <div className="flex-1 p-8 flex flex-col items-center text-center overflow-y-auto">
        <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-orange-500/20">
          <Sparkles size={40} className="text-white" />
        </div>
        
        <h1 className="text-3xl font-bold mb-2">{t('pro.title')}</h1>
        <p className="text-slate-400 mb-8">{t('pro.subtitle')}</p>

        {/* If user already has Pro, show subscription info */}
        {isPro && subscription ? (
          <div className="w-full max-w-md space-y-4 mb-8">
            <div className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Check size={24} className="text-green-400" />
                <span className="text-xl font-bold text-green-400">{t('pro.active')}</span>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-slate-400">
                  {subscription.plan === 'pro_monthly' ? t('pro.planMonthly') : t('pro.planYearly')}
                </p>
                <p className="text-sm text-slate-300">
                  {t('pro.expiresOn')}: <span className="font-bold">{formatExpiryDate(subscription.expiresAtIso)}</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/profile')}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl font-medium transition-colors"
            >
              {t('common.back')}
            </button>
          </div>
        ) : (
          <>
            {/* Plan Selection */}
            <div className="w-full max-w-md mb-6 space-y-3">
              {/* Monthly Plan */}
              <button
                onClick={() => setSelectedPlan('pro_monthly')}
                className={`w-full p-6 rounded-2xl border-2 transition-all ${
                  selectedPlan === 'pro_monthly'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Clock size={20} className="text-indigo-400" />
                    <span className="font-bold text-lg">{t('pro.planMonthly')}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${plans.pro_monthly.price}</div>
                    <div className="text-xs text-slate-400">{plans.pro_monthly.duration}</div>
                  </div>
                </div>
                {selectedPlan === 'pro_monthly' && (
                  <div className="flex items-center justify-center space-x-2 text-indigo-400 text-sm">
                    <Check size={16} />
                    <span>{t('pro.selected')}</span>
                  </div>
                )}
              </button>

              {/* Yearly Plan */}
              <button
                onClick={() => setSelectedPlan('pro_yearly')}
                className={`w-full p-6 rounded-2xl border-2 transition-all relative ${
                  selectedPlan === 'pro_yearly'
                    ? 'border-green-500 bg-green-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                {/* Savings Badge */}
                <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {t('pro.save')} {plans.pro_yearly.savings}%
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Calendar size={20} className="text-green-400" />
                    <span className="font-bold text-lg">{t('pro.planYearly')}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">${plans.pro_yearly.price}</div>
                    <div className="text-xs text-slate-400">{plans.pro_yearly.duration}</div>
                  </div>
                </div>
                {selectedPlan === 'pro_yearly' && (
                  <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                    <Check size={16} />
                    <span>{t('pro.selected')}</span>
                  </div>
                )}
              </button>
            </div>

            {/* Benefits List */}
            <div className="w-full max-w-md bg-slate-800 rounded-2xl p-6 border border-slate-700 mb-6">
              <h3 className="font-bold text-lg mb-4">{t('pro.benefits')}</h3>
              <ul className="space-y-3 text-left">
                {[
                  t('pro.benefit1'),
                  t('pro.benefit2'),
                  t('pro.benefit3'),
                  t('pro.benefit4'),
                  t('pro.benefit5'),
                  t('pro.benefit6')
                ].map((benefit, i) => (
                  <li key={i} className="flex items-center space-x-3">
                    <div className="bg-green-500/20 text-green-400 p-1 rounded-full flex-shrink-0">
                      <Check size={14} />
                    </div>
                    <span className="text-sm font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Subscribe Button */}
            <button
              onClick={handleUpgrade}
              className={`w-full max-w-md py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-lg shadow-xl hover:opacity-90 transition-opacity`}
            >
              {t('pro.upgrade')} - ${plans[selectedPlan].price}
            </button>
            
            <p className="text-xs text-slate-500 mt-4 max-w-md">
              {t('pro.recurringBilling')}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
