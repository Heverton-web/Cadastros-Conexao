import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import {
  salvarEmpresaConfig,
  listarEmpresas,
  buscarEmpresaConfig,
  type Empresa,
} from "~/features/empresas";
import { useState, useEffect } from "react";
import { Palette, Save, Loader2, Building2 } from "lucide-react";
import toast from "react-hot-toast";

export const adminTemaRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/empresa/tema",
  component: AdminTema,
});

const CORES_PADRAO: Record<string, string> = {
  accent: "#c9a655",
  accent_hover: "#d4b366",
  gradient_start: "#c9a655",
  gradient_mid: "#e8d48b",
  gradient_end: "#a8873a",
};

const LABELS_CORES: Record<string, string> = {
  accent: "Destaque (Principal)",
  accent_hover: "Destaque (Passar o Mouse)",
  gradient_start: "Gradiente - Cor Inicial",
  gradient_mid: "Gradiente - Cor Central",
  gradient_end: "Gradiente - Cor Final",
  text: "Cor do Texto",
  primary: "Cor Primária",
  secondary: "Cor Secundária",
  background: "Fundo Geral",
};

function AdminTema() {
  const { profile, empresa: minhaEmpresa } = useAuth();

  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [empresaId, setEmpresaId] = useState("");
  const [empresaNome, setEmpresaNome] = useState("");
  const [loadingEmp, setLoadingEmp] = useState(true);

  const [cores, setCores] = useState<Record<string, string>>(CORES_PADRAO);
  const [saving, setSaving] = useState(false);

  // Init: set default empresa from user's empresa, or first in list
  useEffect(() => {
    if (!profile?.is_super_admin) return;
    listarEmpresas().then((emps) => {
      setEmpresas(emps);
      const defaultId = minhaEmpresa?.id ?? emps[0]?.id ?? "";
      setEmpresaId(defaultId);
      setLoadingEmp(false);
    });
  }, [profile, minhaEmpresa]);

  // Load config when empresaId changes
  useEffect(() => {
    if (!empresaId) return;
    const emp = empresas.find((e) => e.id === empresaId);
    setEmpresaNome(emp?.nome ?? "");
    buscarEmpresaConfig(empresaId).then((config) => {
      if (config) {
        setCores({
          ...CORES_PADRAO,
          ...((config.theme ?? {}) as Record<string, string>),
        });
      } else {
        setCores(CORES_PADRAO);
      }
    });
  }, [empresaId, empresas]);

  if (!profile?.is_super_admin) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text-muted text-sm">
          Acesso restrito ao administrador da empresa.
        </p>
      </div>
    );
  }

  async function handleSave() {
    if (!empresaId) return;
    setSaving(true);
    try {
      await salvarEmpresaConfig(empresaId, { theme: cores });
      toast.success(`Tema salvo para ${empresaNome}!`);
    } catch (e: any) {
      toast.error(e.message);
    }
    setSaving(false);
  }

  function handleCorChange(key: string, value: string) {
    setCores((prev) => ({ ...prev, [key]: value }));
  }

  if (loadingEmp) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-text-main">
            Personalizar Tema
          </h1>
          <p className="text-xs text-text-muted">Cores da marca</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !empresaId}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {saving ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <Save size={14} />
          )}
          Salvar
        </button>
      </div>

      {/* Seletor de empresa */}
      <div className="mb-4 p-3 rounded-lg bg-card border border-border-subtle">
        <div className="flex items-center gap-2">
          <Building2 size={14} className="text-text-muted" />
          <select
            value={empresaId}
            onChange={(e) => setEmpresaId(e.target.value)}
            className="flex-1 px-3 py-1.5 rounded-lg bg-input-bg border border-input-border text-text-main text-sm"
          >
            {empresas.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-card border border-border-subtle">
          <h2 className="text-sm font-bold text-text-main mb-3">
            Cores da Marca
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(cores)
              .filter(([key]) => LABELS_CORES[key] !== undefined)
              .map(([key, value]) => (
                <div key={key}>
                  <label className="text-xs text-text-muted font-medium block mb-1">
                    {LABELS_CORES[key]}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value}
                      onChange={(e) => handleCorChange(key, e.target.value)}
                      className="w-8 h-8 rounded border border-input-border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={(e) => handleCorChange(key, e.target.value)}
                      className="flex-1 px-2 py-1 rounded-lg bg-input-bg border border-input-border text-text-main text-xs font-mono"
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-card border border-border-subtle">
          <h2 className="text-sm font-bold text-text-main mb-3">Preview</h2>
          <div className="flex items-center gap-2">
            <Palette size={16} className="text-accent" />
            <div className="flex gap-1">
              {Object.values(cores)
                .slice(0, 3)
                .map((cor, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border border-border-subtle"
                    style={{ backgroundColor: cor }}
                  />
                ))}
            </div>
            <span className="text-xs text-text-muted">
              {empresaNome || "Empresa"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
