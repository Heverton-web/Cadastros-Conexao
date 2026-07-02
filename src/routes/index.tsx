import { createRoute, useNavigate } from "@tanstack/react-router";
import { rootRoute } from "./__root";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { PasswordInput } from "~/components/ui/password-input";
import { useState, useEffect } from "react";
import { supabase } from "~/lib/supabase";
import { useAuth } from "~/lib/auth";
import { useEmpresaTheme } from "~/core/theme";
import {
  Loader2,
  Fingerprint,
  AlertTriangle,
  X,
  Mail,
  ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

export const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, user, loading } = useAuth();
  const { logoIndexUrl, empresaNome } = useEmpresaTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Popups
  const [popup, setPopup] = useState<"inativo" | "reset" | null>(null);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!loading && user && !redirected) rotearPosLogin();
  }, [user, loading]);

  async function rotearPosLogin() {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (!currentUser) return;
    const { data: profile } = await supabase
      .from("profiles")
      .select("ambiente, ativo")
      .eq("id", currentUser.id)
      .single();

    if (!profile) return;
    if (profile.ativo === false) {
      setPopup("inativo");
      return;
    }

    setRedirected(true);
    const amb = profile.ambiente;
    if (amb === "consultor") navigate({ to: "/cadastros/consultor" });
    else if (amb === "tecnologia" || amb === "suporte")
      navigate({ to: "/credenciais" });
    else navigate({ to: "/cadastros/dashboard" });
  }

  async function handleLogin() {
    if (!email || !password) return;
    setSubmitting(true);
    setErrorMsg("");
    try {
      await login(email, password);
      await rotearPosLogin();
    } catch (e: any) {
      const rawMsg = e?.message;
      const msg =
        typeof rawMsg === "string" &&
        rawMsg.trim() !== "{}" &&
        rawMsg.trim() !== ""
          ? rawMsg
          : "Erro ao fazer login. Verifique suas credenciais.";

      if (
        msg.includes("Invalid login credentials") ||
        msg.includes("invalid_credentials")
      ) {
        setErrorMsg("Email ou senha inválidos.");
      } else if (msg.includes("Failed to fetch") || msg.includes("fetch")) {
        setErrorMsg("Failed to fetch");
      } else {
        setErrorMsg(msg);
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#040914]">
        <Loader2 size={24} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-[#040914] px-6 overflow-hidden select-none">
      {/* Luz de fundo (Glow Azul) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-blue-600/10 blur-[130px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-[390px] rounded-[2rem] bg-[#0b121f]/90 p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
        {/* Linha dourada brilhante superior */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#c9a655] to-transparent rounded-t-[2rem] opacity-80" />

        {/* Logo */}
        <div className="mx-auto mb-6 flex items-center justify-center">
          {logoIndexUrl ? (
            <img
              src={logoIndexUrl}
              className="h-16 w-auto object-contain"
              alt="Logo"
            />
          ) : (
            <img
              src="/logos/logo-vertical-branco.png"
              className="h-16 w-auto object-contain"
              alt="Logo"
            />
          )}
        </div>

        {/* Título e Subtítulo */}
        <div className="text-center mb-6 flex flex-col gap-0.5">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Entrar
          </h1>
          <span className="text-xs font-bold text-[#c9a655] tracking-[0.25em] uppercase">
            {empresaNome || "Conexão"}
          </span>
        </div>

        {/* Banner de Erro Inline */}
        {errorMsg && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-500/20 bg-red-950/20 px-4 py-3 text-xs text-red-400 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
          className="flex flex-col gap-5"
        >
          <div>
            <label className="text-xs font-bold text-[#4e6178] uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="bg-[#131d30] border-[#1f2f4d] focus:border-[#c9a655]/50 focus:ring-0 text-white rounded-xl placeholder-[#41536b] text-sm h-11 w-full"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#4e6178] uppercase tracking-wider mb-1.5 block">
              Senha
            </label>
            <PasswordInput
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="bg-[#131d30] border-[#1f2f4d] text-white placeholder:text-gray-500 rounded-xl px-4 py-3 w-full outline-none focus:border-[#c9a655] transition-all pr-12"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d9b668] to-[#b39145] hover:from-[#e3c174] hover:to-[#c29f52] py-3 text-sm font-bold text-[#0d1625] transition-all duration-300 shadow-[0_4px_20px_rgba(201,166,85,0.2)] cursor-pointer group"
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin text-[#0d1625]" />
            ) : (
              <>
                <span className="flex-1 text-center pl-4">
                  Entrar na Plataforma
                </span>
                <ChevronRight
                  size={16}
                  className="text-[#0d1625] transition-transform group-hover:translate-x-0.5"
                />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="absolute bottom-6 flex items-center justify-center gap-2 text-text-muted/20">
        <Fingerprint size={12} />
        <span className="text-[8px] tracking-[0.2em] uppercase">
          Conexão Implantes
        </span>
      </div>

      {/* POPUP - INATIVO */}
      {popup === "inativo" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#0b121f] border border-[#1b2a47] p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-400" />
                <h2 className="text-base font-bold text-text-main">
                  Usuário Inativo
                </h2>
              </div>
              <button
                onClick={() => {
                  setPopup(null);
                  navigate({ to: "/" });
                }}
                className="text-text-muted hover:text-text-main"
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm text-text-muted mb-6">
              Sua conta está inativa. Entre em contato com o administrador do
              sistema.
            </p>
            <Button
              fullWidth
              onClick={() => {
                supabase.auth.signOut();
                setPopup(null);
              }}
            >
              Sair
            </Button>
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
    } catch {
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0b121f] border border-[#1b2a47] p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-text-main">
            Redefinir Senha
          </h2>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-main"
          >
            <X size={20} />
          </button>
        </div>
        {sent ? (
          <>
            <p className="text-sm text-text-muted mb-6">
              Email enviado! Verifique sua caixa de entrada e siga as
              instruções.
            </p>
            <Button fullWidth onClick={onClose}>
              Fechar
            </Button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <p className="text-sm text-text-muted">
              Digite seu email para receber o link de recuperação.
            </p>
            <Input
              id="reset-email"
              label="Email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#131d30] border-[#1f2f4d] focus:border-[#c9a655]/50 focus:ring-0 text-white rounded-xl placeholder-[#41536b] text-sm h-11 w-full"
            />
            <Button
              type="submit"
              fullWidth
              disabled={submitting}
              className="cursor-pointer"
            >
              {submitting ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Mail size={18} />
              )}
              Enviar link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
