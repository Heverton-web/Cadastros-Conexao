import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "~/core/supabase";
import { useAuth } from "~/core/auth";
import type { Empresa, EmpresaConfig } from "./types";

type EmpresaContextValue = {
  empresa: Empresa | null;
  config: EmpresaConfig | null;
  loading: boolean;
};

const EmpresaContext = createContext<EmpresaContextValue>({
  empresa: null,
  config: null,
  loading: true,
});

export function EmpresaProvider({ children }: { children: ReactNode }) {
  const { profile } = useAuth();
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [config, setConfig] = useState<EmpresaConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.empresa_id) {
      setEmpresa(null);
      setConfig(null);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const [empresaRes, configRes] = await Promise.all([
        supabase.from("empresas").select("*").eq("id", profile!.empresa_id).single(),
        supabase.from("empresas_config").select("*").eq("empresa_id", profile!.empresa_id).single(),
      ]);
      if (!cancelled) {
        setEmpresa(empresaRes.data as Empresa | null);
        setConfig(configRes.data as EmpresaConfig | null);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [profile?.empresa_id]);

  return (
    <EmpresaContext.Provider value={{ empresa, config, loading }}>
      {children}
    </EmpresaContext.Provider>
  );
}

export { EmpresaContext };
