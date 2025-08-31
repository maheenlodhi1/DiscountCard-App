// context/LanguageContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { I18nManager } from "react-native";
import * as Updates from "expo-updates";
import * as Localization from "expo-localization";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setLocale } from "../lib/i18n";

type Language = "en" | "ar";

const LanguageContext = createContext<{
  language: Language;
  changeLanguage: (lang: Language) => void;
}>({
  language: "en",
  changeLanguage: () => {},
});

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const loadLanguage = async () => {
      const storedLang = (await AsyncStorage.getItem(
        "appLanguage"
      )) as Language | null;
      const deviceLang = Localization.getLocales()[0]?.languageCode;

      const langToUse: Language =
        storedLang ?? (deviceLang === "ar" ? "ar" : "en");

      setLocale(langToUse);
      setLanguage(langToUse);

      const isRTL = langToUse === "ar";
      if (I18nManager.isRTL !== isRTL) {
        I18nManager.forceRTL(isRTL);
        await Updates.reloadAsync();
      }
    };

    loadLanguage();
  }, []);

  const changeLanguage = async (lang: Language) => {
    await AsyncStorage.setItem("appLanguage", lang);
    setLocale(lang);
    setLanguage(lang);

    const isRTL = lang === "ar";
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.forceRTL(isRTL);
      await Updates.reloadAsync();
    }
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
