import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import it from "../locales/it";
import en from "../locales/en";

export const LANGUAGES = ["it", "en"] as const;
export type Language = (typeof LANGUAGES)[number];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { it: { translation: it }, en: { translation: en } },
    supportedLngs: LANGUAGES,
    nonExplicitSupportedLngs: true,
    load: "languageOnly",
    fallbackLng: "it",
    interpolation: { escapeValue: false },
    detection: { order: ["localStorage", "navigator"], caches: ["localStorage"] },
  });

const syncHtmlLang = (lng: string) => {
  document.documentElement.lang = lng.startsWith("en") ? "en" : "it";
};
syncHtmlLang(i18n.resolvedLanguage ?? "it");
i18n.on("languageChanged", syncHtmlLang);

export const currentLanguage = (): Language => (i18n.resolvedLanguage?.startsWith("en") ? "en" : "it");

export default i18n;
