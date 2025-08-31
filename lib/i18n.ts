// i18n.ts
import { I18n } from "i18n-js";
import * as Localization from "expo-localization";
import en from "../locales/en.json";
import ar from "../locales/ar.json";

type TranslationKeys = keyof typeof en;

const translations: Record<string, typeof en> = {
  en,
  ar,
};

const i18n = new I18n(translations);

i18n.locale = Localization.getLocales()?.[0]?.languageCode || "en";
i18n.defaultLocale = "en";
i18n.fallbacks = true;

export const setLocale = (locale: string) => {
  i18n.locale = locale;
};

export const t = (
  key: TranslationKeys,
  options?: Record<string, string | number>
): string => i18n.t(key, options);

export default i18n;
