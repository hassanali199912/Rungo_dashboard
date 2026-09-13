import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationARIndex from './locales/ar/index.json';
import translationENIndex from './locales/en/index.json';


const resources = {
    ar: {
        index: translationARIndex,
    },
    en: {
        index: translationENIndex,

    },
};

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
        resources,

        fallbackLng: 'ar',
        supportedLngs: ['ar', 'en'],

        ns: ['index'],
        defaultNS: 'index',

        interpolation: {
            escapeValue: false,
        },

        react: {
            transSupportBasicHtmlNodes: true,
            transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'p'],
        },

        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng',
        },
    });

i18n.on('languageChanged', (lng) => {
    const html = document.documentElement;
    html.lang = lng;
    html.dir = lng === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem("lang", lng);
});

export default i18n;