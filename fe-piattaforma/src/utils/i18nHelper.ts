/* eslint-disable @typescript-eslint/ban-ts-comment */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// @ts-ignore
import itPack from '/public/locales/it/translation.json';
// @ts-ignore
import dePack from '/public/locales/de/translation.json';

export const i18nInit = () => {
  i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init(
      {
        resources: {
          it: {
            translation: itPack,
          },
          de: {
            translation: dePack,
          },
        },
        lng: 'it',
        fallbackLng: 'it',

        interpolation: {
          escapeValue: false, // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
        },
      },
      (err, t) => {
        if (err) return console.log('something went wrong loading', err);
        t('key');
      }
    );
};

export const i18nChangeLanguage = (newLanguage: 'it' | 'de') => {
  i18n.changeLanguage(newLanguage, (err, t) => {
    if (err) return console.log('something went wrong loading', err);
    t('key'); // -> same as i18next.t
  });
};
