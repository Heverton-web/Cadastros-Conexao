import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, Home } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import '../styles/theme.css';
import { toggleCartDrawer } from '../services/ui.service';
import { useCarrinho, cartTotais } from '../services/carrinho.service';
import { CartDrawer } from './CartDrawer';
import { ImageViewer } from './ImageViewer';
import { ProductSheet } from './ProductSheet';

export function StoreLayout({ children }: { children: React.ReactNode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const cart = useCarrinho();
  const { qtd } = cartTotais(cart);

  return (
    <div className="catalogo-theme flex flex-col relative min-h-screen">
      <header className="sticky top-0 z-40 bg-[#0f172a]/80 backdrop-blur-2xl border-b border-[var(--color-accent-muted)] h-20 px-6 lg:px-16 flex items-center justify-between shadow-2xl shadow-[var(--color-accent-muted)]">
        <div className="flex items-center gap-8">
          <Link to="/catalogo" className="flex items-center hover:scale-105 transition-transform">
            <img src="/logos/logo-horizontal-branco.png" alt="Conexão" className="h-7 object-contain" />
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-widest text-[var(--color-text-muted)]">
            <Link to="/catalogo/implantes" className="hover:text-[var(--color-accent)] transition-colors py-2 [&.active]:text-[var(--color-accent)]">
              IMPLANTES
            </Link>
            <Link to="/catalogo/componentes" className="hover:text-[var(--color-accent)] transition-colors py-2 [&.active]:text-[var(--color-accent)]">
              COMPONENTES
            </Link>
            <Link to="/catalogo/kits" className="hover:text-[var(--color-accent)] transition-colors py-2 [&.active]:text-[var(--color-accent)]">
              KITS
            </Link>
            <Link to="/catalogo/promocionais" className="hover:text-[var(--color-accent)] transition-colors py-2 [&.active]:text-[var(--color-accent)]">
              PROMOÇÕES
            </Link>
          </nav>
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
          <Link
            to="/catalogo"
            className="group p-3 rounded-full bg-[var(--color-surface)] border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:bg-[var(--color-surface-hover)] transition-all"
          >
            <Home className="w-5 h-5 text-white group-hover:text-[var(--color-accent)] transition-colors" />
          </Link>
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
      
      <main className="flex-1">{children}</main>

      {/* Global Modals */}
      <CartDrawer />
      <ImageViewer />
      <ProductSheet />
    </div>
  );
}
