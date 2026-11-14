import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import type { Language } from "../config/i18n";

export const useLang = (): Language => {
  const { i18n } = useTranslation();
  return i18n.resolvedLanguage?.startsWith("en") ? "en" : "it";
};

/** Sets document title and meta description for the current page. */
export const useDocumentTitle = (title: string | undefined) => {
  const { t } = useTranslation();
  const description = t("meta.description");
  useEffect(() => {
    if (title) document.title = title;
    document.querySelector('meta[name="description"]')?.setAttribute("content", description);
  }, [title, description]);
};
