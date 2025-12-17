import { en } from './en';
import { ru } from './ru';
import { de } from './de';
import { es } from './es';
import { pl } from './pl';

export type Locale = 'en' | 'ru' | 'de' | 'es' | 'pl';

const dictionaries: Record<Locale, Record<string, string>> = {
  en,
  ru,
  de,
  es,
  pl
};

export const LANGUAGES: { code: Locale; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'pl', label: 'Polski' },
];

/**
 * Translates a key for a given locale.
 * Falls back to English if the key is missing.
 */
export function translate(locale: Locale, key: string, params?: Record<string, string | number>): string {
  const dict = dictionaries[locale] || dictionaries['en'];
  let text = dict[key] || dictionaries['en'][key] || key;

  if (params) {
    Object.entries(params).forEach(([paramKey, paramValue]) => {
      text = text.replace(`{${paramKey}}`, String(paramValue));
    });
  }

  return text;
}