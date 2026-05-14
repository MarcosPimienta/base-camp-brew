"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { es } from "@/app/dictionaries/es";
import { en } from "@/app/dictionaries/en";

type Locale = "es" | "en";
type Dictionary = typeof es;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Dictionary) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dicts: Record<Locale, Dictionary> = { es, en };

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const cookieLocale = document.cookie
      .split("; ")
      .find((row) => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1] as Locale | undefined;
    if (cookieLocale && (cookieLocale === "es" || cookieLocale === "en")) {
      setLocaleState(cookieLocale);
    }
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000`;
  }, []);

  const t = useCallback(
    (key: keyof Dictionary): string => {
      return dicts[locale][key] ?? dicts["es"][key] ?? key;
    },
    [locale]
  );

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
