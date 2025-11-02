import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import {en,kn,hi} from './index';

const resource = {en:{translation:en},kn:{translation:kn},hi:{translation:hi}}

i18next.use(initReactI18next).init({
  debug:true,
  lng: 'en',
  resources:resource,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18next;
