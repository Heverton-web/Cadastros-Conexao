import { createRoute, useNavigate } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useState } from "react";
import { Link2, Plus } from "lucide-react";

export const adminLaboratorioRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/admin/laboratorio",
  component: AdminLaboratorio,
});

function AdminLaboratorio() {
  const [links, setLinks] = useState<{ descricao: string; tipo: string; url: string }[]>([]);
  const [descricao, setDescricao] = useState("");
  const [tipo, setTipo] = useState("PF");

  function gerarLink() {
    if (!descricao.trim()) return;
    setLinks(p => [...p, { descricao: descricao.trim(), tipo, url: `${window.location.origin}/pre-cadastro/${crypto.randomUUID()}` }]);
    setDescricao("");
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="rounded-xl bg-card p-5 shadow-lg">
        <h2 className="text-sm font-bold text-text-main flex items-center gap-2 mb-4">
          <Link2 size={16} className="text-accent" /> Links de Teste Rota Coleta
        </h2>

        <div className="flex flex-col gap-3 md:flex-row items-end mb-4 bg-input-bg p-3 rounded-lg border border-input-border">
          <div className="flex-1 w-full">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Descrição do Teste</label>
            <input value={descricao} onChange={e => setDescricao(e.target.value)}
              placeholder="Ex: QA Pessoa Física"
              className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent" />
          </div>
          <div className="w-full md:w-32">
            <label className="text-[10px] text-text-muted ml-1 mb-1 block">Tipo Cliente</label>
            <select value={tipo} onChange={e => setTipo(e.target.value)}
              className="w-full rounded-xl border border-input-border bg-bg-dark px-3 py-2 text-sm text-text-main outline-none focus:border-accent">
              <option value="PF">Física</option>
              <option value="PJ">Jurídica</option>
            </select>
          </div>
          <button onClick={gerarLink} disabled={!descricao.trim()}
            className="flex items-center justify-center gap-1 rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50">
            <Plus size={16} /> Gerar Link
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {links.length === 0 ? (
            <p className="text-xs text-text-muted py-4 text-center">Nenhum link gerado.</p>
          ) : (
            links.map((link, i) => (
              <div key={i} className="rounded-lg bg-input-bg p-3 border border-border-subtle flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-text-main">{link.descricao}</p>
                  <p className="text-[10px] text-text-muted mt-0.5">{link.tipo === "PF" ? "Física" : "Jurídica"}</p>
                  <code className="text-[10px] text-accent font-mono block truncate mt-1">{link.url}</code>
                </div>
                <button onClick={() => navigator.clipboard.writeText(link.url)}
                  className="shrink-0 rounded-lg bg-accent/10 px-2.5 py-1.5 text-[10px] font-medium text-accent hover:bg-accent/20 transition-colors">
                  Copiar
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
