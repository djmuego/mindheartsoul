import React, { createContext, useState, ReactNode } from 'react';
import { dictionaries, availableLocales, FALLBACK_LOCALE } from './registry';

const LANG_STORAGE_KEY = 'mhs_lang_v1';

interface I18nContextType {
  lang: string;
  setLang: (lang: string) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  availableLocales: typeof availableLocales;
}

export const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      // Verify if stored lang actually exists in our registry
      if (stored && dictionaries[stored]) {
        return stored;
      }
      return FALLBACK_LOCALE;
    } catch {
      return FALLBACK_LOCALE;
    }
  });

  const setLang = (code: string) => {
    if (dictionaries[code]) {
      setLangState(code);
      localStorage.setItem(LANG_STORAGE_KEY, code);
    } else {
      console.warn(`Attempted to set unknown language: ${code}`);
    }
  };

  const t = (key: string, vars?: Record<string, string | number>): string => {
    // 1. Try current language
    let text = dictionaries[lang]?.[key];

    // 2. Fallback to default language
    if (!text) {
      text = dictionaries[FALLBACK_LOCALE]?.[key];
    }

    // 3. Fallback to key
    if (!text) {
      return key;
    }

    // 4. Interpolate variables
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        text = text.replace(`{${k}}`, String(v));
      });
    }

    return text;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t, availableLocales }}>
      {children}
    </I18nContext.Provider>
  );
};