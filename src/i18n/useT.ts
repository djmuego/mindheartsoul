import { useContext } from 'react';
import { I18nContext } from './I18nProvider';

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Shorthand hook if you only need 't'
export const useT = () => {
  const { t } = useI18n();
  return t;
};