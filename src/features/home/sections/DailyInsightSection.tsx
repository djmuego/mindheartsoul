import React from 'react';
import { useT } from '../../../i18n/useT';
import { Brand } from '../../../constants';
import { ApiKeyWarning } from '../../../components/common/ApiKeyWarning';

export const DailyInsightSection: React.FC = () => {
  const t = useT();
  return (
    <>
      <ApiKeyWarning serviceName="Daily Insight (AI)" />
      <div className={`p-6 rounded-2xl bg-gradient-to-r from-${Brand.colors.primary} to-${Brand.colors.secondary} text-white shadow-lg`}>
        <h2 className="text-lg font-semibold mb-2">{t('home.affirmationTitle')}</h2>
        <p className="opacity-90 italic">{t('home.affirmationBody')}</p>
      </div>
    </>
  );
};