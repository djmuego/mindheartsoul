import React from 'react';
import { Brand } from '../../constants';
import { useSession } from '../../context/SessionContext';
import { useT } from '../../i18n/useT';
import { HOME_SECTIONS } from '../../features/home/sections/registry';

export const HomeScreen: React.FC = () => {
  const { session } = useSession();
  const t = useT();

  return (
    <div className="p-6 space-y-8 bg-slate-50 dark:bg-slate-950 min-h-full transition-colors duration-200">
      <header>
        <h1 className={`text-2xl font-bold text-${Brand.colors.text} dark:text-white`}>
          {t('home.welcome', { name: session.userName || 'Guest' })}
        </h1>
        <p className={`text-${Brand.colors.textMuted} dark:text-slate-400 mt-1`}>
          {t('home.subtitle')}
        </p>
      </header>

      {HOME_SECTIONS
        .filter(section => section.enabled)
        .sort((a, b) => (a.priority || 0) - (b.priority || 0))
        .map(section => (
          <React.Fragment key={section.id}>
            <section.component />
          </React.Fragment>
        ))
      }
    </div>
  );
};