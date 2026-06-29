import { createRoute } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/core/supabase";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import toast from "react-hot-toast";
import { ROLE_LABEL, type AppRole } from "~/lib/auth";

export const crmDevUsuariosRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/crm/dev/usuarios",
  component: UsuariosPage,
});

function UsuariosPage() {
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["dev-usuarios"],
    queryFn: async () => {
      const { data } = await supabase
        .from("usuarios")
        .select("id, nome_completo, email_corporativo, celular_corporativo, role, gestor_id, diretor_id, ativo, criado_em")
        .order("role")
        .order("nome_completo");
      return data ?? [];
    },
  });

  async function toggleAtivo(id: string, ativo: boolean) {
    const { error } = await supabase.from("usuarios").update({ ativo: !ativo }).eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(ativo ? "Usuário inativado" : "Usuário ativado");
    qc.invalidateQueries({ queryKey: ["dev-usuarios"] });
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Usuários</h1>
        <p className="text-sm text-muted-foreground">
          Lista completa. Use o botão para ativar ou inativar acesso.
        </p>
      </header>

      <div className="glass rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40">
            <tr>
              <th className="text-left p-3 font-semibold">Nome</th>
              <th className="text-left p-3 font-semibold hidden md:table-cell">Contato</th>
              <th className="text-left p-3 font-semibold">Perfil</th>
              <th className="text-left p-3 font-semibold">Status</th>
              <th className="text-right p-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(data ?? []).map((u: any) => (
              <tr key={u.id}>
                <td className="p-3 font-medium">{u.nome_completo}</td>
                <td className="p-3 text-muted-foreground hidden md:table-cell text-xs">
                  <div>{u.email_corporativo}</div>
                  {u.celular_corporativo && <div>{u.celular_corporativo}</div>}
                </td>
                <td className="p-3">
                  <Badge variant="secondary">{ROLE_LABEL[u.role as AppRole] ?? u.role}</Badge>
                </td>
                <td className="p-3">
                  <span className={`text-xs ${u.ativo ? "text-[var(--color-success)]" : "text-destructive"}`}>
                    {u.ativo ? "● ativo" : "● inativo"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => toggleAtivo(u.id, u.ativo)}>
                    {u.ativo ? "Inativar" : "Ativar"}
                  </Button>
                </td>
              </tr>
            ))}
            {!data?.length && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground text-sm">Nenhum usuário.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
