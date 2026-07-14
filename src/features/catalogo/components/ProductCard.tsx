import React from 'react';
import { ArrowRight } from 'lucide-react';
import '../styles/theme.css';
import { ProductThumb } from './ProductThumb';

interface Props {
  sku: string;
  nome: string;
  corIdentificacao: string;
  tipo: string;
}

export function ProductCard({ sku, nome, corIdentificacao, tipo }: Props) {
  const cor = corIdentificacao || '#c9a655';

  return (
    <div
      className="group relative h-full rounded-2xl bg-[var(--color-surface)]/60 backdrop-blur-md border border-[var(--color-border-subtle)] transition-all duration-300 overflow-hidden"
      style={{ "--card-color": cor, borderWidth: "0.5px" } as React.CSSProperties}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at top left, ${cor}10 0%, transparent 70%)` }}
      />

      {/* Barra lateral accent */}
      <div className="absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full" style={{ backgroundColor: cor }} />

      <div className="relative z-10 flex flex-col h-full p-5 pl-6">
        {/* Topo: badge + dot */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest"
            style={{ color: cor, backgroundColor: `${cor}12`, border: `0.5px solid ${cor}20` }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: cor, boxShadow: `0 0 4px ${cor}50` }} />
            {tipo}
          </span>
        </div>

        {/* Nome + SKU */}
        <div className="flex-1 min-w-0 mb-4">
          <h3 className="text-base font-bold text-white leading-tight mb-2 transition-colors line-clamp-2">
            {nome}
          </h3>
          <p className="text-[11px] font-mono text-[var(--color-text-muted)] tracking-widest truncate">
            SKU: {sku}
          </p>
        </div>

        {/* Rodapé: CTA */}
        <div className="flex items-center gap-2 pt-3 border-t border-[var(--color-border-subtle)] group-hover:border-[var(--card-color,var(--color-accent))]/20 transition-colors">
          <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] group-hover:text-white transition-colors">
            Ver Ficha Técnica
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-muted)] group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}
