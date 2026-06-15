import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "@/data/translations";

const AppContext = createContext(null);

export const OMR_TO_USD = 2.6;

export function AppProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    if (typeof window === "undefined") return "en";
    return localStorage.getItem("dcd_lang") || "en";
  });
  const [currency, setCurrency] = useState(() => {
    if (typeof window === "undefined") return "OMR";
    return localStorage.getItem("dcd_curr") || "OMR";
  });

  useEffect(() => {
    localStorage.setItem("dcd_lang", language);
    if (typeof document !== "undefined") {
      document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = language;
    }
  }, [language]);

  useEffect(() => {
    localStorage.setItem("dcd_curr", currency);
  }, [currency]);

  const t = (key) => {
    const dict = translations[language] || translations.en;
    return dict[key] ?? translations.en[key] ?? key;
  };

  const formatPrice = (omrValue) => {
    if (omrValue == null) return "—";
    if (currency === "USD") {
      const usd = Math.round(omrValue * OMR_TO_USD);
      return `$${usd.toLocaleString("en-US")}`;
    }
    const prefix = language === "ar" ? "ر.ع. " : "OMR ";
    return `${prefix}${Math.round(omrValue).toLocaleString("en-US")}`;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      currency,
      setCurrency,
      t,
      formatPrice,
      isRTL: language === "ar",
    }),
    [language, currency]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
};
