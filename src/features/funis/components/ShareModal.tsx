import { useState } from "react";
import { X, Search, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { usePermissoesFunil, useConcederPermissao, useRevogarPermissao } from "../hooks/useFunisData";
import { buscarUsuarioEmail } from "../services";
import type { FunilPermissaoNivel } from "../types";

type ShareModalProps = {
  funilId: string;
  onClose: () => void;
};

export function ShareModal({ funilId, onClose }: ShareModalProps) {
  const { data: permissoes } = usePermissoesFunil(funilId);
  const conceder = useConcederPermissao();
  const revogar = useRevogarPermissao();
  const [email, setEmail] = useState("");
  const [nivel, setNivel] = useState<FunilPermissaoNivel>("view");
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!email.trim()) return;
    setSearching(true);
    setError("");
    const user = await buscarUsuarioEmail(email.trim());
    setSearching(false);
    if (!user) {
      setError("Usuario nao encontrado");
      return;
    }
    await conceder.mutateAsync({ funilId, userId: user.id, nivel });
    setEmail("");
  };

  const handleRevoke = async (id: string) => {
    await revogar.mutateAsync(id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-card rounded-xl w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-border-subtle">
          <h2 className="text-lg font-semibold text-text-main">Compartilhar Funil</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email do usuario"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 px-3 py-2 rounded-lg bg-surface border border-border-subtle text-text-main focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <select
              value={nivel}
              onChange={(e) => setNivel(e.target.value as FunilPermissaoNivel)}
              className="px-2 py-2 rounded-lg bg-surface border border-border-subtle text-text-main text-sm"
            >
              <option value="view">Visualizar</option>
              <option value="edit">Editar</option>
            </select>
            <Button onClick={handleAdd} size="sm" disabled={searching || !email.trim()}>
              <Search className="w-4 h-4" />
            </Button>
          </div>
          {error && <p className="text-xs text-error">{error}</p>}

          {permissoes && permissoes.length > 0 && (
            <div className="space-y-2">
              {permissoes.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 px-3 bg-surface rounded-lg">
                  <div>
                    <p className="text-sm text-text-main">{(p as any).user?.full_name ?? "Usuario"}</p>
                    <p className="text-xs text-text-muted">{(p as any).user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-text-muted px-2 py-1 rounded bg-surface">
                      {p.nivel === "edit" ? "Editor" : "Visualizar"}
                    </span>
                    <button onClick={() => handleRevoke(p.id)} className="text-text-muted hover:text-error">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="flex justify-end p-4 border-t border-border-subtle">
          <Button onClick={onClose} variant="secondary" size="sm">
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
