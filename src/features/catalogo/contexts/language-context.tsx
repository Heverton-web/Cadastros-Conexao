import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import i18n from "~/core/i18n";

const STORAGE_KEY = "catalogo-lang";

type LangCode = "pt-BR" | "en-US" | "es-ES";

interface CatalogoLangContextValue {
  language: LangCode | null;
  setLanguage: (lang: LangCode) => void;
  ready: boolean;
}

const CatalogoLangContext = createContext<CatalogoLangContextValue>({
  language: null,
  setLanguage: () => {},
  ready: false,
});

export function useCatalogoLang() {
  return useContext(CatalogoLangContext);
}

function getStoredLang(): LangCode | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "pt-BR" || stored === "en-US" || stored === "es-ES") return stored;
  } catch {}
  return null;
}

export function CatalogoLangProvider({ children }: { children: ReactNode }) {
  const [language, setLangState] = useState<LangCode | null>(getStoredLang);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (language) {
      i18n.changeLanguage(language).then(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [language]);

  const setLanguage = useCallback((lang: LangCode) => {
    localStorage.setItem(STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
    setLangState(lang);
  }, []);

  return (
    <CatalogoLangContext.Provider value={{ language, setLanguage, ready }}>
      {children}
    </CatalogoLangContext.Provider>
  );
}
