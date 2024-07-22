import * as I18n from "i18n-js";
import * as Localization from "expo-localization";
import en from "./locales/en.json";
import ja from "./locales/ja.json";
import { getLanguage } from "./language";

const i18n = I18n.default;

i18n.translations = {
  en,
  ja,
};

const locales = Localization.getLocales();

i18n.defaultLocale = "en";
i18n.fallbacks = true;
i18n.locale = locales[0]?.languageTag || "en";

export const setI18nConfig = async () => {
  const language = await getLanguage();
  i18n.locale = language || locales[0]?.languageTag || "en";
};

export default i18n;
