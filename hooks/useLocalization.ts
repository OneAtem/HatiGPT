
import { useState, useEffect, useCallback } from 'react';
import { translations } from '../locales';

export type Language = 'en' | 'fa';
type TranslationKey = keyof (typeof translations)['en'];

const isLanguage = (lang: string): lang is Language => {
  return lang === 'en' || lang === 'fa';
};

export const useLocalization = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLang = localStorage.getItem('hati-gpt-language');
    if (savedLang && isLanguage(savedLang)) {
      return savedLang;
    }
    return 'fa';
  });

  useEffect(() => {
    localStorage.setItem('hati-gpt-language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'fa' ? 'rtl' : 'ltr';
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.');
      let result: any = translations[language];
      for (const k of keys) {
        result = result?.[k];
        if (result === undefined) {
          // Fallback to English if key not found in current language
          let fallbackResult: any = translations['en'];
          for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
          }
          return fallbackResult || key;
        }
      }
      return result;
    },
    [language]
  );

  return { language, changeLanguage, t };
};