import { type ReactNode } from "react";
import { CatalogoLangProvider, useCatalogoLang } from "../contexts/language-context";
import { LanguageSplash } from "./LanguageSplash";

function LangGate({ children }: { children: ReactNode }) {
  const { language, ready } = useCatalogoLang();
  if (!ready) return null;
  if (!language) return <LanguageSplash />;
  return <>{children}</>;
}

export function PublicLangWrapper({ children }: { children: ReactNode }) {
  return (
    <CatalogoLangProvider>
      <LangGate>{children}</LangGate>
    </CatalogoLangProvider>
  );
}
