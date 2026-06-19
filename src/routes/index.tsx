import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useState, useEffect } from "react";
import { supabase } from "~/lib/supabase";
import { useAuth } from "~/lib/auth";
import { Loader2, LogIn, Fingerprint, AlertTriangle, X, Mail } from "lucide-react";
import toast from "react-hot-toast";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Popups
  const [popup, setPopup] = useState<"inativo" | "nao_encontrada" | "erro" | "reset" | null>(null);
  const [popupMsg, setPopupMsg] = useState("");
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!loading && user && !redirected) rotearPosLogin();
  }, [user, loading]);

  async function rotearPosLogin() {
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (!currentUser) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("ambiente, ativo, role")
      .eq("id", currentUser.id)
      .single();

    if (!profile?.ativo) { setPopup("inativo"); return; }

    setRedirected(true);
    const amb = profile.ambiente;
    if (amb === "consultor") navigate({ to: "/consultor" });
    else if (amb === "tecnologia") navigate({ to: "/credenciais" });
    else navigate({ to: "/dashboard" });
  }

  async function handleLogin() {
    if (!email || !password) return;
    setSubmitting(true);
    setPopup(null);
    try {
      await login(email, password);
      await rotearPosLogin();
    } catch (e: any) {
      const msg = e?.message || "Erro ao fazer login";
      if (msg.includes("Invalid login credentials")) {
        setPopup("nao_encontrada");
      } else {
        setPopupMsg(msg);
        setPopup("erro");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-bg-dark">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="flex min-h-dvh flex-col bg-bg-dark px-6">
      <div className="flex flex-1 flex-col items-center justify-center">
        <div className="mb-6 flex flex-col items-center gap-2">
          <img src="/logos/logo-horizontal-branco.png" alt="Conexão Implantes" className="h-7 object-contain opacity-80" />
          <div className="text-center">
            <h1 className="text-base font-bold text-text-main">Entrar na Plataforma</h1>
            <p className="text-xs text-text-muted mt-0.5">Acesse sua conta de cadastros</p>
          </div>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="flex w-full max-w-sm flex-col gap-4">
          <Input id="email" label="Email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
          <Input id="password" label="Senha" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />

          <Button type="submit" fullWidth disabled={submitting}>
            {submitting ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
            Entrar
          </Button>
        </form>

        <button type="button" onClick={() => setPopup("reset")}
          className="mt-5 text-xs text-text-muted hover:text-accent transition-colors">
          Deseja redefinir sua senha? <span className="underline">Clique Aqui</span>
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 pb-6 text-text-muted/30">
        <Fingerprint size={14} />
        <span className="text-[10px] tracking-wider uppercase">Conexão Implantes</span>
      </div>

      {/* POPUP - INATIVO */}
      {popup === "inativo" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-400" />
                <h2 className="text-base font-bold text-text-main">Usuário Inativo</h2>
              </div>
              <button onClick={() => { setPopup(null); navigate({ to: "/" }); }} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <p className="text-sm text-text-muted mb-6">Sua conta está inativa. Entre em contato com o administrador do sistema.</p>
            <Button fullWidth onClick={() => { supabase.auth.signOut(); setPopup(null); }}>Sair</Button>
          </div>
        </div>
      )}

      {/* POPUP - CONTA NÃO ENCONTRADA */}
      {popup === "nao_encontrada" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-yellow-400" />
                <h2 className="text-base font-bold text-text-main">Conta não encontrada</h2>
              </div>
              <button onClick={() => setPopup(null)} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <p className="text-sm text-text-muted mb-2">Email ou senha inválidos. Verifique suas credenciais e tente novamente.</p>
            <p className="text-xs text-text-muted mb-6">Se você não possui cadastro, entre em contato com o administrador.</p>
            <Button fullWidth onClick={() => setPopup(null)}>Fechar</Button>
          </div>
        </div>
      )}

      {/* POPUP - ERROS */}
      {popup === "erro" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
          <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-400" />
                <h2 className="text-base font-bold text-text-main">Erro</h2>
              </div>
              <button onClick={() => setPopup(null)} className="text-text-muted hover:text-text-main"><X size={20} /></button>
            </div>
            <p className="text-sm text-text-muted mb-6">{popupMsg}</p>
            <Button fullWidth onClick={() => setPopup(null)}>Fechar</Button>
          </div>
        </div>
      )}

      {/* POPUP - RESETE SENHA */}
      {popup === "reset" && <ResetSenhaPopup onClose={() => setPopup(null)} />}
    </div>
  );
}

function ResetSenhaPopup({ onClose }: { onClose: () => void }) {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch { } finally { setSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6">
      <div className="w-full max-w-md rounded-2xl bg-card p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-text-main">Redefinir Senha</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-main"><X size={20} /></button>
        </div>
        {sent ? (
          <>
            <p className="text-sm text-text-muted mb-6">Email enviado! Verifique sua caixa de entrada e siga as instruções.</p>
            <Button fullWidth onClick={onClose}>Fechar</Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-text-muted">Digite seu email para receber o link de recuperação.</p>
            <Input id="reset-email" label="Email" type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? <Loader2 size={18} className="animate-spin" /> : <Mail size={18} />}
              Enviar link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
