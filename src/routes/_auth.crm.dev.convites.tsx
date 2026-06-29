import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "~/integrations/supabase/client";
import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Badge } from "~/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "~/components/ui/select";
import { toast } from "sonner";
import { Copy, Send, Trash2, RefreshCw, Ban, Loader2, MessageCircle, UserPlus } from "lucide-react";
import { ROLE_LABEL, type AppRole } from "~/hooks/useAuth";

export const Route = createFileRoute("/_auth/dev/convites")({
  component: ConvitesPage,
});

type RoleConvite = "dev" | "diretor_comercial" | "gestor" | "consultor";

const VALIDADES = [
  { v: "24", l: "24 horas" },
  { v: "48", l: "48 horas" },
  { v: "72", l: "72 horas" },
  { v: "120", l: "120 horas" },
];

const EMPTY = {
  nome: "",
  email: "",
  celular: "",
  role: "consultor" as RoleConvite,
  gestor_id: "",
  diretor_id: "",
  validade: "72",
};

function gerarToken() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(input: string) {
  const buf = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

function ConvitesPage() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ ...EMPTY });
  const [busy, setBusy] = useState(false);

  const { data: usuarios } = useQuery({
    queryKey: ["convites-usuarios"],
    queryFn: async () => {
      const { data } = await supabase
        .from("usuarios")
        .select("id, nome_completo, role")
        .in("role", ["gestor", "diretor_comercial"]);
      return data ?? [];
    },
  });

  const gestores = useMemo(() => (usuarios ?? []).filter((u: any) => u.role === "gestor"), [usuarios]);
  const diretores = useMemo(() => (usuarios ?? []).filter((u: any) => u.role === "diretor_comercial"), [usuarios]);

  const { data: convites } = useQuery({
    queryKey: ["convites-list"],
    queryFn: async () => {
      const { data } = await supabase
        .from("convites_acesso")
        .select("id, email_destino, nome_destino, celular_corporativo, role_atribuida, gestor_vinculado_id, diretor_vinculado_id, data_expiracao, status, criado_em, token_hash")
        .order("criado_em", { ascending: false });
      return data ?? [];
    },
  });

  function set<K extends keyof typeof EMPTY>(k: K, v: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  function buildLink(token: string) {
    return `${window.location.origin}/aceitar-convite/${token}`;
  }

  function buildWhatsapp(celular: string, link: string, nome: string) {
    const tel = celular.replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá ${nome}! Seu acesso à plataforma Conexão Implantes está liberado.\n\nClique para criar sua senha:\n${link}`
    );
    return `https://wa.me/${tel}?text=${msg}`;
  }

  async function criar() {
    if (!form.nome.trim() || !form.email.trim() || !form.celular.trim()) {
      toast.error("Preencha nome, e-mail e celular.");
      return;
    }
    if (form.role === "gestor" && !form.diretor_id) {
      toast.error("Selecione o diretor vinculado.");
      return;
    }
    if (form.role === "consultor" && !form.gestor_id) {
      toast.error("Selecione o gestor vinculado.");
      return;
    }

    setBusy(true);
    try {
      const token = gerarToken();
      const token_hash = await sha256(token);
      const data_expiracao = new Date(Date.now() + Number(form.validade) * 3600 * 1000).toISOString();
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase.from("convites_acesso").insert({
        email_destino: form.email.trim(),
        nome_destino: form.nome.trim(),
        celular_corporativo: form.celular.trim(),
        role_atribuida: form.role,
        gestor_vinculado_id: form.role === "consultor" ? form.gestor_id : null,
        diretor_vinculado_id: form.role === "gestor" ? form.diretor_id : null,
        token_hash,
        data_expiracao,
        status: "pendente",
        criado_por_id: user?.id,
      });
      if (error) throw error;

      const link = buildLink(token);
      await navigator.clipboard.writeText(link).catch(() => {});
      toast.success("Convite criado", {
        description: "Magic link copiado para a área de transferência.",
      });
      setForm({ ...EMPTY });
      qc.invalidateQueries({ queryKey: ["convites-list"] });
    } catch (e: any) {
      toast.error("Erro", { description: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function revogar(id: string) {
    const { error } = await supabase.from("convites_acesso").update({ status: "expirado" }).eq("id", id);
    if (error) return toast.error("Erro", { description: error.message });
    toast.success("Convite revogado");
    qc.invalidateQueries({ queryKey: ["convites-list"] });
  }

  async function excluir(id: string) {
    const { error } = await supabase.from("convites_acesso").delete().eq("id", id);
    if (error) return toast.error("Erro", { description: error.message });
    toast.success("Convite excluído");
    qc.invalidateQueries({ queryKey: ["convites-list"] });
  }

  async function reenviar(c: any) {
    const token = gerarToken();
    const token_hash = await sha256(token);
    const data_expiracao = new Date(Date.now() + 72 * 3600 * 1000).toISOString();
    const { error } = await supabase
      .from("convites_acesso")
      .update({ token_hash, data_expiracao, status: "pendente" })
      .eq("id", c.id);
    if (error) return toast.error("Erro", { description: error.message });
    const link = buildLink(token);
    await navigator.clipboard.writeText(link).catch(() => {});
    toast.success("Novo link gerado", { description: "Copiado para a área de transferência." });
    qc.invalidateQueries({ queryKey: ["convites-list"] });
  }

  function vinculadoLabel(c: any) {
    const u = (usuarios ?? []).find((x: any) =>
      x.id === c.gestor_vinculado_id || x.id === c.diretor_vinculado_id
    );
    return u?.nome_completo ?? "—";
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Convites</h1>
        <p className="text-sm text-muted-foreground">
          Gere magic links com expiração configurável. O destinatário define a senha ao aceitar.
        </p>
      </header>

      <section className="glass rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-gold inline-flex items-center gap-2">
          <UserPlus className="h-4 w-4" /> Novo convite
        </h2>

        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Perfil">
            <Select value={form.role} onValueChange={(v) => set("role", v as RoleConvite)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="dev">Desenvolvedor</SelectItem>
                <SelectItem value="diretor_comercial">Diretor Comercial</SelectItem>
                <SelectItem value="gestor">Gestor</SelectItem>
                <SelectItem value="consultor">Consultor</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <Field label="Validade">
            <Select value={form.validade} onValueChange={(v) => set("validade", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {VALIDADES.map((v) => <SelectItem key={v.v} value={v.v}>{v.l}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label="Nome completo">
            <Input value={form.nome} onChange={(e) => set("nome", e.target.value)} />
          </Field>
          <Field label="E-mail corporativo">
            <Input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} />
          </Field>
          <Field label="Celular corporativo">
            <Input value={form.celular} onChange={(e) => set("celular", e.target.value)} placeholder="+5511999999999" />
          </Field>

          {form.role === "gestor" && (
            <Field label="Diretor vinculado">
              <Select value={form.diretor_id} onValueChange={(v) => set("diretor_id", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {diretores.map((d: any) => (
                    <SelectItem key={d.id} value={d.id}>{d.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}

          {form.role === "consultor" && (
            <Field label="Gestor vinculado">
              <Select value={form.gestor_id} onValueChange={(v) => set("gestor_id", v)}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {gestores.map((g: any) => (
                    <SelectItem key={g.id} value={g.id}>{g.nome_completo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
        </div>

        <Button onClick={criar} disabled={busy}>
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="mr-2 h-4 w-4" /> Gerar convite</>}
        </Button>
      </section>

      <section>
        <h2 className="mb-3 text-xs uppercase tracking-wider text-muted-foreground font-semibold">Histórico</h2>
        <div className="glass rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40">
              <tr>
                <th className="text-left p-3">Destinatário</th>
                <th className="text-left p-3 hidden md:table-cell">Perfil</th>
                <th className="text-left p-3 hidden lg:table-cell">Vinculado a</th>
                <th className="text-left p-3 hidden md:table-cell">Expira</th>
                <th className="text-left p-3">Status</th>
                <th className="text-right p-3">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {!convites?.length && (
                <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nenhum convite emitido.</td></tr>
              )}
              {convites?.map((c: any) => (
                <tr key={c.id}>
                  <td className="p-3">
                    <div className="font-medium">{c.nome_destino ?? c.email_destino}</div>
                    <div className="text-xs text-muted-foreground">{c.email_destino}</div>
                  </td>
                  <td className="p-3 hidden md:table-cell">
                    <Badge variant="secondary">{ROLE_LABEL[c.role_atribuida as AppRole] ?? c.role_atribuida}</Badge>
                  </td>
                  <td className="p-3 hidden lg:table-cell text-xs">{vinculadoLabel(c)}</td>
                  <td className="p-3 hidden md:table-cell text-xs">
                    {new Date(c.data_expiracao).toLocaleString("pt-BR")}
                  </td>
                  <td className="p-3">
                    <Badge variant={c.status === "pendente" ? "default" : "secondary"} className="capitalize">
                      {c.status}
                    </Badge>
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex gap-1">
                      {c.status === "pendente" && c.celular_corporativo && (
                        <Button size="icon" variant="ghost" title="WhatsApp"
                          onClick={() => {
                            const link = buildLink("__token__");
                            window.open(buildWhatsapp(c.celular_corporativo, link, c.nome_destino ?? ""), "_blank");
                            toast.message("Use o botão Reenviar para gerar um novo link válido.");
                          }}>
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {c.status === "pendente" && (
                        <Button size="icon" variant="ghost" title="Reenviar (gera novo link)" onClick={() => reenviar(c)}>
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                      )}
                      {c.status === "pendente" && (
                        <Button size="icon" variant="ghost" title="Revogar" onClick={() => revogar(c.id)}>
                          <Ban className="h-4 w-4" />
                        </Button>
                      )}
                      {c.status !== "utilizado" && (
                        <Button size="icon" variant="ghost" title="Excluir" onClick={() => excluir(c.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
