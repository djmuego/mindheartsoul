import React, { useMemo } from 'react';
import { Brand } from '../../constants';
import { useSession } from '../../context/SessionContext';
import { useT } from '../../i18n/useT';
import { HOME_SECTIONS, getVisibleSections } from '../../features/home/sections/registry';
import { useFeatureFlags } from '../../hooks/useFeatureFlags';
import { useEntitlements } from '../../hooks/useEntitlements';

export const HomeScreen: React.FC = () => {
  const { session, user } = useSession();
  const t = useT();
  const { flags } = useFeatureFlags();
  const { isPro } = useEntitlements();

  // Memoize visible sections to avoid recalculating on every render
  const visibleSections = useMemo(() => {
    return getVisibleSections(
      HOME_SECTIONS,
      user?.role,
      flags,
      isPro
    );
  }, [user?.role, flags, isPro]);

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

      {visibleSections.map(section => (
        <React.Fragment key={section.id}>
          <section.component />
        </React.Fragment>
      ))}
    </div>
  );
};