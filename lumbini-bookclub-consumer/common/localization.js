import { createContext, useCallback, useContext } from "react";
import { KEY_APP_LOCALE } from "./app.config";
import en from "../locales/en.json";
import mm from "../locales/mm.json";

export const LocaleContext = createContext({
  locale: "mm",
  setLocale: (value) => {},
});

export const useLocalization = () => {
  const localeContext = useContext(LocaleContext);

  const localize = useCallback(
    (key) => {
      if (localeContext.locale === "mm") {
        return mm[key] ?? key;
      }

      return en[key] ?? key;
    },
    [localeContext]
  );

  const change = useCallback(
    (locale) => {
      localeContext.setLocale(locale);
      localStorage.setItem(KEY_APP_LOCALE, locale);
    },
    [localeContext]
  );

  return { localize, change, locale: localeContext.locale };
};
