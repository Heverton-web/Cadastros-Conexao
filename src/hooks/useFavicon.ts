import { useEffect } from "react";
import { useAuth } from "~/lib/auth";
import { useEmpresaTheme } from "~/core/theme";

const GENERIC_FAVICON = "/favicon-generic.svg";

export function useFavicon() {
  const { empresa } = useAuth();
  const { logoAppUrl } = useEmpresaTheme();

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (!link) return;

    const newHref = empresa?.id && logoAppUrl ? logoAppUrl : GENERIC_FAVICON;

    if (link.href !== newHref) {
      link.href = newHref;
    }
  }, [empresa?.id, logoAppUrl]);
}
