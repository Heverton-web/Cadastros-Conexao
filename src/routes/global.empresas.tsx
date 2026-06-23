import { createRoute, Link } from "@tanstack/react-router";
import { authLayout } from "./_auth";
import { useAuth } from "~/lib/auth";
import { listarEmpresas, toggleEmpresa, deletarEmpresa, criarEmpresa, type Empresa } from "~/lib/empresas";
import { criarCredencial } from "~/lib/credenciais";
import { getAllModules } from "~/registry";
import { supabase } from "~/core/supabase";
import { useState, useEffect, useCallback } from "react";
import { Plus, Power, Trash2, Building2, Loader2, X, ChevronRight, Pencil, ChevronDown, Palette, Image, MapPin, Globe, AtSign, ToggleLeft, ToggleRight, Shield, KeyRound, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "~/lib/utils";
import { SectionCard, Grid, Field, CollapsibleSection } from "~/features/empresas/components";

export const adminSuperEmpresasRoute = createRoute({
  getParentRoute: () => authLayout,
  path: "/global/empresas",
  component: AdminSuperEmpresas,
});

function AdminSuperEmpresas() {
  const { profile } = useAuth();
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (profile?.is_super_admin) carregar();
  }, [profile]);

  async function carregar() {
    setLoading(true);
    const data = await listarEmpresas();
    setEmpresas(data);
    setLoading(false);
  }

  if (!profile?.is_super_admin) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-text-muted text-sm">Acesso restrito ao Super Admin.</p>
      </div>
    );
  }

  async function handleToggle(id: string, ativo: boolean) {
    try {
      await toggleEmpresa(id, !ativo);
      toast.success(`Empresa ${!ativo ? "ativada" : "inativada"}`);
      await carregar();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  async function handleDelete(id: string, nome: string) {
    if (!confirm(`Tem certeza que deseja deletar "${nome}"?\n\nTodos os dados vinculados serao perdidos permanentemente!`)) return;
    try {
      await deletarEmpresa(id);
      toast.success("Empresa deletada");
      await carregar();
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-text-main">Empresas</h1>
          <p className="text-xs text-text-muted">Gerenciamento de empresas do ERP</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-fg text-sm font-medium hover:bg-accent-hover transition-colors">
          <Plus size={16} />
          Nova Empresa
        </button>
      </div>

      <div className="space-y-2">
        {empresas.map((emp) => (
          <div key={emp.id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border-subtle">
            <div className="flex items-center gap-3">
              <Building2 size={20} className="text-accent" />
              <div>
                <span className="text-sm font-medium text-text-main">{emp.nome}</span>
                <span className="text-[10px] text-text-muted block">
                  {emp.slug} {emp.cnpj ? `| ${emp.cnpj}` : ""}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${emp.ativo ? "bg-success-bg text-success" : "bg-error-bg text-error"}`}>
                {emp.ativo ? "Ativo" : "Inativo"}
              </span>
              <Link to="/global/empresas/$id" params={{ id: emp.id }} className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-surface-hover transition-colors" title="Editar">
                <Pencil size={14} />
              </Link>
              <button onClick={() => handleToggle(emp.id, emp.ativo)} className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-surface-hover transition-colors" title="Ativar/Inativar">
                <Power size={14} />
              </button>
              <button onClick={() => handleDelete(emp.id, emp.nome)} className="p-1.5 rounded-lg text-text-muted hover:text-red-400 hover:bg-surface-hover transition-colors" title="Deletar">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {empresas.length === 0 && (
          <p className="text-center text-sm text-text-muted py-8">Nenhuma empresa cadastrada.</p>
        )}
      </div>

      {showModal && <CriarEmpresaModal onClose={() => setShowModal(false)} onCreated={() => { setShowModal(false); carregar(); }} />}
    </div>
  );
}

/* ───── Modal de criação ───── */

const CORES_INICIAIS: Record<string, string> = {
  accent: "#c9a655",
  accent_hover: "#d4b366",
  gradient_start: "#c9a655",
  gradient_mid: "#e8d48b",
  gradient_end: "#a8873a",
};

type FormData = {
  nome: string;
  slug: string;
  cnpj: string;
  razao_social: string;
  nome_app: string;
  email: string;
  celular: string;
  telefone: string;
  logradouro: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  site: string;
  logo_index_url: string;
  logo_app_url: string;
  favicon_url: string;
  admin_nome: string;
  admin_celular: string;
  admin_email: string;
  admin_senha: string;
  admin_role: "admin" | "editor" | "viewer";
};

function CriarEmpresaModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [form, setForm] = useState<FormData>({
    nome: "", slug: "", cnpj: "", razao_social: "", nome_app: "",
    email: "", celular: "", telefone: "",
    logradouro: "", numero: "", bairro: "", cidade: "", estado: "", cep: "",
    instagram: "", youtube: "", linkedin: "", site: "",
    logo_index_url: "", logo_app_url: "", favicon_url: "",
    admin_nome: "", admin_celular: "", admin_email: "", admin_senha: "", admin_role: "admin",
  });
  const [modulosAtivos, setModulosAtivos] = useState<Record<string, boolean>>({});
  const [cores, setCores] = useState<Record<string, string>>(CORES_INICIAIS);
  const [creating, setCreating] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>({
    contato: false, endereco: false, redes: false, design: false, branding: false, modulos: false, admin: false,
  });

  const registeredModules = getAllModules();

  const toggleSection = useCallback((key: string) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const h = (k: keyof FormData) => (v: string) => setForm((p) => ({ ...p, [k]: v }));

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.slug) return;
    setCreating(true);
    try {
      const empresa = await criarEmpresa({
        nome: form.nome,
        slug: form.slug,
        cnpj: form.cnpj || undefined,
        razao_social: form.razao_social || undefined,
        nome_app: form.nome_app || undefined,
        email: form.email || undefined,
        celular: form.celular || undefined,
        telefone: form.telefone || undefined,
        logradouro: form.logradouro || undefined,
        numero: form.numero || undefined,
        bairro: form.bairro || undefined,
        cidade: form.cidade || undefined,
        estado: form.estado || undefined,
        cep: form.cep || undefined,
        instagram: form.instagram || undefined,
        youtube: form.youtube || undefined,
        linkedin: form.linkedin || undefined,
        site: form.site || undefined,
        theme: cores,
        logo_index_url: form.logo_index_url || undefined,
        logo_app_url: form.logo_app_url || undefined,
        favicon_url: form.favicon_url || undefined,
      });

      // Ativar módulos selecionados
      for (const [modKey, ativo] of Object.entries(modulosAtivos)) {
        if (ativo) {
          const { error } = await supabase
            .from("modulos_empresa")
            .upsert(
              { empresa_id: empresa.id, modulo_key: modKey, ativo: true },
              { onConflict: "empresa_id,modulo_key" }
            );
          if (error) console.error(`Erro ao ativar módulo ${modKey}:`, error);
        }
      }

      // Criar credencial admin
      if (form.admin_nome && form.admin_email) {
        try {
          await criarCredencial({
            nome_completo: form.admin_nome,
            email_corporativo: form.admin_email,
            whatsapp_corporativo: form.admin_celular || undefined,
            empresa_id: empresa.id,
          });
        } catch (credErr) {
          console.error("Erro ao criar credencial:", credErr);
        }

        // Criar auth user + atualizar profile
        if (form.admin_senha) {
          try {
            const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
              email: form.admin_email,
              password: form.admin_senha,
              options: {
                data: {
                  nome: form.admin_nome,
                  empresa_id: empresa.id,
                },
              },
            });
            if (signUpErr) {
              toast.error("Admin criado, mas erro ao criar usuário auth: " + signUpErr.message);
            } else if (signUpData?.user) {
              // Aguarda trigger criar profile, depois atualiza role + celular
              await new Promise((r) => setTimeout(r, 1000));
              const { error: updateErr } = await supabase
                .from("profiles")
                .update({ role: form.admin_role, nome: form.admin_nome, celular: form.admin_celular || null })
                .eq("id", signUpData.user.id);
              if (updateErr) console.error("Erro ao atualizar role do admin:", updateErr);
            }
          } catch (authErr: any) {
            toast.error("Erro ao criar usuário auth: " + authErr.message);
          }
        }
      }

      toast.success(`Empresa "${empresa.nome}" criada!`);
      onCreated();
    } catch (e: any) {
      toast.error(e.message);
    }
    setCreating(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-2xl bg-card border border-border-subtle p-6 shadow-xl mt-4 mb-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-bold text-text-main">Nova Empresa</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main"><X size={20} /></button>
        </div>

        <form onSubmit={handleCreate} className="flex flex-col gap-5">

          {/* Identificação (sempre visível) */}
          <SectionCard icon={Building2} title="Identificação">
            <Grid>
              <Field label="Nome Interno *" value={form.nome} onChange={(v) => {
                const slug = v.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                setForm((p) => ({ ...p, nome: v, slug }));
              }} required />
              <Field label="Slug *" value={form.slug} onChange={h("slug")} fontMono required />
              <Field label="Nome na Aplicação" value={form.nome_app} onChange={h("nome_app")} />
              <Field label="Razão Social" value={form.razao_social} onChange={h("razao_social")} />
              <Field label="CNPJ" value={form.cnpj} onChange={h("cnpj")} />
            </Grid>
          </SectionCard>

          {/* Contato */}
          <CollapsibleSection icon={AtSign} title="Contato" open={sections.contato} onToggle={() => toggleSection("contato")}>
            <Grid>
              <Field label="Email" value={form.email} onChange={h("email")} type="email" />
              <Field label="Celular / WhatsApp" value={form.celular} onChange={h("celular")} />
              <Field label="Telefone Fixo" value={form.telefone} onChange={h("telefone")} />
            </Grid>
          </CollapsibleSection>

          {/* Endereço */}
          <CollapsibleSection icon={MapPin} title="Endereço" open={sections.endereco} onToggle={() => toggleSection("endereco")}>
            <Grid>
              <Field label="Logradouro" value={form.logradouro} onChange={h("logradouro")} className="col-span-2" />
              <Field label="Número" value={form.numero} onChange={h("numero")} />
              <Field label="Bairro" value={form.bairro} onChange={h("bairro")} />
              <Field label="Cidade" value={form.cidade} onChange={h("cidade")} />
              <Field label="Estado" value={form.estado} onChange={h("estado")} />
              <Field label="CEP" value={form.cep} onChange={h("cep")} />
            </Grid>
          </CollapsibleSection>

          {/* Redes Sociais */}
          <CollapsibleSection icon={Globe} title="Redes Sociais" open={sections.redes} onToggle={() => toggleSection("redes")}>
            <Grid>
              <Field label="Instagram" value={form.instagram} onChange={h("instagram")} />
              <Field label="YouTube" value={form.youtube} onChange={h("youtube")} />
              <Field label="LinkedIn" value={form.linkedin} onChange={h("linkedin")} />
              <Field label="Site" value={form.site} onChange={h("site")} type="url" />
            </Grid>
          </CollapsibleSection>

          {/* Design */}
          <CollapsibleSection icon={Palette} title="Design (Cores da Marca)" open={sections.design} onToggle={() => toggleSection("design")}>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(cores).map(([key, value]) => (
                <div key={key}>
                  <label className="text-[10px] text-text-muted font-medium block mb-1">{key}</label>
                  <div className="flex items-center gap-2">
                    <input type="color" value={value} onChange={(e) => setCores((p) => ({ ...p, [key]: e.target.value }))}
                      className="w-8 h-8 rounded border border-input-border cursor-pointer bg-transparent" />
                    <input type="text" value={value} onChange={(e) => setCores((p) => ({ ...p, [key]: e.target.value }))}
                      className="flex-1 px-2 py-1 rounded-lg bg-input-bg border border-input-border text-text-main text-xs font-mono" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2">
              <Palette size={16} className="text-accent" />
              <div className="flex gap-1">
                {Object.values(cores).slice(0, 3).map((cor, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border border-border-subtle" style={{ backgroundColor: cor }} />
                ))}
              </div>
            </div>
          </CollapsibleSection>

          {/* Branding */}
          <CollapsibleSection icon={Image} title="Branding (Logos e Favicon)" open={sections.branding} onToggle={() => toggleSection("branding")}>
            <p className="text-[10px] text-text-muted mb-3">Cole URLs externas para as imagens. Upload pode ser feito depois na edição da empresa.</p>
            <Field label="Logo da Página de Login (URL)" value={form.logo_index_url} onChange={h("logo_index_url")} />
            <Field label="Logo da Aplicação / Header (URL)" value={form.logo_app_url} onChange={h("logo_app_url")} />
            <Field label="Favicon (URL)" value={form.favicon_url} onChange={h("favicon_url")} />
          </CollapsibleSection>

          {/* Módulos Ativos */}
          <CollapsibleSection icon={ToggleRight} title="Módulos da Empresa" open={sections.modulos} onToggle={() => toggleSection("modulos")}>
            <p className="text-[10px] text-text-muted mb-3">Selecione os módulos que estarão disponíveis para esta empresa.</p>
            <div className="space-y-1">
              {registeredModules.map((mod) => {
                const ativo = modulosAtivos[mod.key] ?? false;
                return (
                  <div key={mod.key} className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-surface-hover transition-colors">
                    <div className="flex items-center gap-2.5">
                      <mod.icon size={16} className={ativo ? "text-accent" : "text-text-muted"} />
                      <div>
                        <span className="text-sm font-medium text-text-main">{mod.nome}</span>
                        <span className="text-[10px] text-text-muted block">{mod.descricao}</span>
                      </div>
                    </div>
                    <button type="button" onClick={() => setModulosAtivos((p) => ({ ...p, [mod.key]: !ativo }))}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        ativo ? "bg-success/10 text-success" : "bg-error/10 text-error"
                      }`}>
                      {ativo ? <><ToggleRight size={14} /> Ativo</> : <><ToggleLeft size={14} /> Inativo</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>

          {/* Credencial Admin */}
          <CollapsibleSection icon={Shield} title="Credencial de Acesso do Admin" open={sections.admin} onToggle={() => toggleSection("admin")}>
            <p className="text-[10px] text-text-muted mb-3">Crie o usuário administrador da empresa. Ele receberá acesso ao sistema com as permissões definidas abaixo.</p>
            <Grid>
              <Field label="Nome Completo" value={form.admin_nome} onChange={h("admin_nome")} />
              <Field label="Celular / WhatsApp" value={form.admin_celular} onChange={h("admin_celular")} />
              <Field label="Email" value={form.admin_email} onChange={h("admin_email")} type="email" />
              <Field label="Senha" value={form.admin_senha} onChange={h("admin_senha")} type="password" />
            </Grid>
            <div className="mt-3">
              <label className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1.5 block">Role / Nível de Acesso</label>
              <div className="flex gap-2">
                {(["admin", "editor", "viewer"] as const).map((role) => (
                  <button key={role} type="button" onClick={() => setForm((p) => ({ ...p, admin_role: role }))}
                    className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                      form.admin_role === role
                        ? "bg-accent text-white border-accent"
                        : "bg-input-bg text-text-muted border-input-border hover:text-text-main"
                    )}>
                    <Shield size={12} />
                    {role === "admin" ? "Admin" : role === "editor" ? "Editor" : "Visualizador"}
                  </button>
                ))}
              </div>
            </div>
          </CollapsibleSection>

          <button type="submit" disabled={creating}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-accent text-accent-fg py-3 text-sm font-bold hover:bg-accent-hover transition-all disabled:opacity-50">
            {creating ? <Loader2 size={16} className="animate-spin" /> : <><span>Criar Empresa</span><ChevronRight size={16} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ───── Seções ───── importadas de features/empresas/components */
