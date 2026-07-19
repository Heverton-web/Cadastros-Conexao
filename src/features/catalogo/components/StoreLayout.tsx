import React, { useState, useEffect, createContext, useContext } from 'react';
import { Search, ShoppingBag, Menu, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import '../styles/theme.css';
import { toggleCartDrawer } from '../services/ui.service';
import { useCarrinho, cartTotais, setCarrinhoScope } from '../services/carrinho.service';
import { useAuth } from '~/lib/auth';
import { CartDrawer } from './CartDrawer';
import { ImageViewer } from './ImageViewer';
import { EMPRESA_ID } from '~/config/empresa';
import { ProductSheet } from './ProductSheet';

export const CatalogoVisibilityContext = createContext({ showPrices: true, showSearchBar: true });
export const useCatalogoVisibility = () => useContext(CatalogoVisibilityContext);
import { supabase } from '~/lib/supabase';
import { getCatalogoDesign, mergeWithDefaults } from '../services/design.service';

interface StoreLayoutProps {
  children: React.ReactNode;
  empresaId?: string | null;
  fullHeight?: boolean;
  zoom?: number;
}

/**
 * Aplica CSS vars no :root (document.documentElement) para garantir
 * prioridade máxima sobre as defs hardcoded do theme.css.
 */
function applyDesignToRoot(config: ReturnType<typeof mergeWithDefaults>) {
  const root = document.documentElement;
  const cssMap: Record<string, string> = {
    '--color-accent': config.colors.accent,
    '--color-accent-hover': config.colors.accentHover,
    '--color-accent-fg': config.colors.accentFg,
    '--color-bg': config.colors.bg,
    '--color-surface': config.colors.surface,
    '--color-surface-hover': config.colors.surfaceHover,
    '--color-card': config.colors.card,
    '--color-text-main': config.colors.textMain,
    '--color-text-muted': config.colors.textMuted,
    '--color-border-subtle': config.colors.borderSubtle,
    '--color-input-bg': config.colors.inputBg,
    '--color-input-border': config.colors.inputBorder,
    '--color-success': config.colors.success,
    '--color-error': config.colors.error,
    '--color-accent-muted': `${config.colors.accent}1f`,
    '--catalogo-hero-bg': config.images.heroBackgroundUrl || '',
    '--catalogo-page-bg': config.images.pageBackgroundUrl || '',
    '--catalogo-font-family': config.typography.fontFamily || "'Inter', sans-serif",
    '--catalogo-font-mono': config.typography.fontFamilyMono || "'JetBrains Mono', monospace",
  };
  for (const [k, v] of Object.entries(cssMap)) {
    root.style.setProperty(k, v);
  }
  // Aplica fonte no body
  document.body.style.fontFamily = config.typography.fontFamily || "'Inter', sans-serif";
}

export function StoreLayout({ children, empresaId: empresaIdProp, fullHeight, zoom }: StoreLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackVisible, setIsBackVisible] = useState(false);
  const [resolvedEmpresaId, setResolvedEmpresaId] = useState<string | null>(empresaIdProp ?? EMPRESA_ID ?? null);
  const [visibility, setVisibility] = useState({ showPrices: true, showSearchBar: true });
  const navigate = useNavigate();
  const cart = useCarrinho();
  const { qtd } = cartTotais(cart);
  const { profile } = useAuth();

  // Isola o carrinho por empresa + usuário logado (multi-tenant).
  useEffect(() => {
    setCarrinhoScope(resolvedEmpresaId, profile?.id ?? null);
  }, [resolvedEmpresaId, profile?.id]);
  // Resolve empresaId: se prop foi passada, usa; senão, usa EMPRESA_ID do config
  useEffect(() => {
    if (empresaIdProp) {
      setResolvedEmpresaId(empresaIdProp);
      return;
    }
    setResolvedEmpresaId(EMPRESA_ID ?? null);
  }, [empresaIdProp]);

  // Check admin
  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_super_admin, role')
        .eq('id', user.id)
        .single();
      if (profile?.is_super_admin || profile?.role === 'admin') {
        setIsBackVisible(true);
      }
    }
    checkAdmin();
  }, []);

  // Carrega design config e aplica no :root
  useEffect(() => {
    if (!resolvedEmpresaId) return;

    let cancelled = false;

    async function loadDesign() {
      try {
        const saved = await getCatalogoDesign(resolvedEmpresaId!);
        const config = mergeWithDefaults(saved as any);

        if (cancelled) return;

        // Aplica no :root para prioridade máxima
        applyDesignToRoot(config);

        // Atualiza visibilidade
        setVisibility({
          showPrices: config.visibility.showPrices,
          showSearchBar: config.visibility.showSearchBar,
        });

        // Background da página
        if (config.images.pageBackgroundUrl) {
          document.body.style.backgroundImage = `url(${config.images.pageBackgroundUrl})`;
          document.body.style.backgroundSize = 'cover';
          document.body.style.backgroundPosition = 'center';
          document.body.style.backgroundAttachment = 'fixed';
        }

        // Favicon: tenta catalogo_design_config, senão fallback para empresas_config
        let faviconSrc = config.images.faviconUrl;
        if (!faviconSrc) {
          const { data: empConfig } = await supabase
            .from("empresas_config")
            .select("favicon_url")
            .eq("empresa_id", resolvedEmpresaId!)
            .single();
          faviconSrc = empConfig?.favicon_url || "";
        }
        if (faviconSrc) {
          let link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
          if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
          }
          link.href = faviconSrc;
        }

        // Logo
        if (config.images.logoUrl) {
          setLogoUrl(config.images.logoUrl);
        } else {
          setLogoUrl('');
        }
      } catch {
        // Fallback: mantém defaults do theme.css
      }
    }
    loadDesign();

    return () => { cancelled = true; };
  }, [resolvedEmpresaId]);

  // Cleanup: remove CSS vars customizadas e restaura favicon ao desmontar
  useEffect(() => {
    return () => {
      const root = document.documentElement;
      const vars = [
        '--color-accent', '--color-accent-hover', '--color-accent-fg',
        '--color-bg', '--color-surface', '--color-surface-hover', '--color-card',
        '--color-text-main', '--color-text-muted', '--color-border-subtle',
        '--color-input-bg', '--color-input-border', '--color-success', '--color-error',
        '--color-accent-muted', '--catalogo-hero-bg', '--catalogo-page-bg',
      ];
      vars.forEach(v => root.style.removeProperty(v));
      document.body.style.backgroundImage = '';
      document.body.style.fontFamily = '';

      // Restaura favicon genérico
      const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
      if (link) {
        link.href = "/favicon-generic.svg";
      }
    };
  }, []);

  return (
    <div
      className={`catalogo-theme flex flex-col relative bg-[var(--color-bg)] ${fullHeight ? 'h-dvh' : 'min-h-dvh'}`}
    >
      <header className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-2xl h-16 lg:h-20 px-3 sm:px-6 lg:px-16 flex items-center justify-between shadow-2xl shadow-[var(--color-accent-muted)]">
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {isBackVisible && (
            <button
              onClick={() => navigate({ to: '/catalogo/admin/dashboard' })}
              className="p-2 lg:p-2.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all"
              title="Voltar ao ERP"
            >
              <ArrowLeft className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
            </button>
          )}
          <div className="flex items-center hover:scale-105 transition-transform min-w-0">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-6 sm:h-8 lg:h-10 object-contain" />
            ) : (
              <img src="/logos/logo-horizontal-branco.png" alt="ERP Odonto" className="h-6 sm:h-8 lg:h-10 object-contain" />
            )}
          </div>
        </div>
        {visibility.showSearchBar && (
          <div className="flex-1 max-w-xl mx-8 relative hidden lg:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar por SKU, Linha ou Dimensão..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-12 pr-4 rounded-full bg-[var(--color-surface)]/50 border border-[var(--color-input-border)] text-sm focus:border-[var(--color-accent)] focus:bg-[var(--color-input-bg)] focus:shadow-[0_0_15px_rgba(201,166,85,0.15)] focus:outline-none transition-all text-white placeholder-[var(--color-text-muted)]"
            />
          </div>
        )}
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
          <Link to="/catalogo" className="group p-2 sm:p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all">
            <Home className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-[var(--color-accent)] transition-colors" />
          </Link>
          <button
            onClick={() => toggleCartDrawer(true)}
            className="group p-2 sm:p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all relative"
          >
            <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white group-hover:text-[var(--color-accent)] transition-colors" />
            {qtd > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-gradient-gold rounded-full text-[9px] sm:text-[10px] font-bold text-[#0f172a] flex items-center justify-center shadow-[0_0_10px_rgba(201,166,85,0.5)] animate-pulse">
                {qtd}
              </span>
            )}
          </button>
          <button className="md:hidden p-1.5 sm:p-2 text-white hover:text-[var(--color-accent)] ml-[-4px]">
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </header>

      <main
        className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden"
        style={zoom ? { zoom: `${zoom}` } : undefined}
      >
        <CatalogoVisibilityContext.Provider value={visibility}>
          {children}
        </CatalogoVisibilityContext.Provider>
      </main>

      {/* Global Modals */}
      <CartDrawer />
      <ImageViewer />
      <ProductSheet />
    </div>
  );
}
