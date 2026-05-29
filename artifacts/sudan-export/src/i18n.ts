import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ar from "./locales/ar.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ar: { translation: ar },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "ar"],
    defaultNS: "translation",
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "sudanexport_lang",
    },
    interpolation: {
      escapeValue: false,
    },
  });

function applyDir(lng: string) {
  const isAr = lng.startsWith("ar");
  document.documentElement.dir = isAr ? "rtl" : "ltr";
  document.documentElement.lang = isAr ? "ar" : "en";
}

i18n.on("languageChanged", applyDir);
applyDir(i18n.language);

export default i18n;
