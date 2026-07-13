import React, { useState, useEffect } from 'react';
import { Search, ShoppingBag, Menu, Home, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import '../styles/theme.css';
import { toggleCartDrawer } from '../services/ui.service';
import { useCarrinho, cartTotais } from '../services/carrinho.service';
import { CartDrawer } from './CartDrawer';
import { ImageViewer } from './ImageViewer';
import { ProductSheet } from './ProductSheet';
import { supabase } from '~/lib/supabase';
import { getCatalogoDesign, mergeWithDefaults } from '../services/design.service';

interface StoreLayoutProps {
  children: React.ReactNode;
  empresaId?: string | null;
  fullHeight?: boolean;
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
  };
  for (const [k, v] of Object.entries(cssMap)) {
    root.style.setProperty(k, v);
  }
}

export function StoreLayout({ children, empresaId: empresaIdProp, fullHeight }: StoreLayoutProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isBackVisible, setIsBackVisible] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [resolvedEmpresaId, setResolvedEmpresaId] = useState<string | null>(empresaIdProp ?? null);
  const navigate = useNavigate();
  const cart = useCarrinho();
  const { qtd } = cartTotais(cart);

  // Resolve empresaId: se prop foi passada, usa; senão, busca do auth
  useEffect(() => {
    if (empresaIdProp) {
      setResolvedEmpresaId(empresaIdProp);
      return;
    }
    async function resolveFromAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('empresa_id')
        .eq('id', user.id)
        .single();
      if (profile?.empresa_id) {
        setResolvedEmpresaId(profile.empresa_id);
      }
    }
    resolveFromAuth();
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

  // Cleanup: remove CSS vars customizadas ao desmontar
  useEffect(() => {
    return () => {
      const root = document.documentElement;
      const vars = [
        '--color-accent', '--color-accent-hover', '--color-accent-fg',
        '--color-bg', '--color-surface', '--color-surface-hover', '--color-card',
        '--color-text-main', '--color-text-muted', '--color-border-subtle',
        '--color-input-bg', '--color-input-border', '--color-success', '--color-error',
        '--color-accent-muted',
      ];
      vars.forEach(v => root.style.removeProperty(v));
    };
  }, []);

  return (
    <div className={`catalogo-theme flex flex-col relative ${fullHeight ? 'h-dvh' : 'min-h-screen'}`}>
      <header className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-2xl h-20 px-6 lg:px-16 flex items-center justify-between shadow-2xl shadow-[var(--color-accent-muted)]">
        <div className="flex items-center gap-4">
          {isBackVisible && (
            <button
              onClick={() => navigate({ to: '/catalogo/admin/dashboard' })}
              className="p-2 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all"
              title="Voltar ao ERP"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <div className="flex items-center hover:scale-105 transition-transform">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-7 object-contain" />
            ) : (
              <img src="/logos/logo-horizontal-branco.png" alt="ERP Odonto" className="h-7 object-contain" />
            )}
          </div>
        </div>
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
        <div className="flex items-center gap-4 lg:gap-6">
          <div className="group p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all">
            <Home className="w-5 h-5 text-white group-hover:text-[var(--color-accent)] transition-colors" />
          </div>
          <button
            onClick={() => toggleCartDrawer(true)}
            className="group p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all relative"
          >
            <ShoppingBag className="w-5 h-5 text-white group-hover:text-[var(--color-accent)] transition-colors" />
            {qtd > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-gold rounded-full text-[10px] font-bold text-[#0f172a] flex items-center justify-center shadow-[0_0_10px_rgba(201,166,85,0.5)] animate-pulse">
                {qtd}
              </span>
            )}
          </button>
          <button className="md:hidden p-2 text-white hover:text-[var(--color-accent)]">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">{children}</main>

      {/* Global Modals */}
      <CartDrawer />
      <ImageViewer />
      <ProductSheet />
    </div>
  );
}
