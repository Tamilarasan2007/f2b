import { createContext, useContext, useState } from 'react';
import { en, ta, hi } from '../translations/translations';

const LanguageContext = createContext();

const languages = { en, ta, hi };
const languageNames = { en: 'English', ta: 'தமிழ் (Tamil)', hi: 'हिन्दी (Hindi)' };

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('f2b_lang') || 'en';
  });

  const t = (key) => languages[lang]?.[key] || languages.en?.[key] || key;

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('f2b_lang', newLang);
  };

  const switchLanguage = setLang;

  return (
    <LanguageContext.Provider value={{ lang, setLang, switchLanguage, t, languageNames, languages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
