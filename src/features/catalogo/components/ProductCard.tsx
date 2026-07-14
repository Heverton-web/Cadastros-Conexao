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
      className="group relative h-full rounded-2xl bg-[var(--color-surface)]/50 backdrop-blur-md border border-[var(--color-border-subtle)] hover:border-[var(--card-color,var(--color-accent))]/40 transition-all duration-300 overflow-hidden p-5 min-h-[88px]"
      style={{ "--card-color": cor, borderWidth: "0.5px" } as React.CSSProperties}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(circle at top left, ${cor}10 0%, transparent 70%)` }}
      />

      <div className="flex items-center gap-4 relative z-10">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors"
          style={{ backgroundColor: `${cor}12` }}
        >
          <div className="w-3 h-3 rounded-full transition-all" style={{ backgroundColor: cor, boxShadow: `0 0 6px ${cor}40` }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center mb-1">
             <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: cor }}>
               {tipo}
             </span>
          </div>
          <h3 className="text-sm font-bold text-white leading-tight mb-1 transition-colors line-clamp-1 group-hover:text-[var(--card-color,var(--color-accent))]">
            {nome}
          </h3>
          <p className="text-[10px] font-mono text-[var(--color-text-muted)] tracking-widest truncate">
            SKU: {sku}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
           <ArrowRight className="w-4 h-4 text-[var(--color-text-muted)] group-hover:text-white group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
}
