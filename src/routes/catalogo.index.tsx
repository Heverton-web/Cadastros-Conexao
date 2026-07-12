import { createRoute, Link } from "@tanstack/react-router"
import { rootRoute } from "./__root"
import { StoreLayout } from "~/features/catalogo/components/StoreLayout"
import { Package, Layers, ShoppingBag, Tag, Crosshair, ShieldCheck, Box } from "lucide-react"

export const catalogoIndexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalogo",
  component: CatalogoIndexPage,
})

function CatalogoIndexPage() {
  const cat = [
    {
      id: 'implantes',
      title: 'Implantes',
      desc: 'Cone Morse, HE, HI.',
      icon: <Crosshair className="w-8 h-8 text-[var(--color-accent)]" />,
    },
    {
      id: 'componentes',
      title: 'Componentes',
      desc: 'Pilares e Motor Protético.',
      icon: <ShieldCheck className="w-8 h-8 text-[var(--color-accent)]" />,
    },
    {
      id: 'kits',
      title: 'Kits',
      desc: 'Maletas e Cirurgia Guiada.',
      icon: <Box className="w-8 h-8 text-[var(--color-accent)]" />,
    },
    {
      id: 'promocionais',
      title: 'Promoções',
      desc: 'Ofertas exclusivas e combos.',
      icon: <Tag className="w-8 h-8 text-[var(--color-accent)]" />,
    },
  ];

  return (
    <StoreLayout>
      <div className="relative border-b border-[var(--color-border-subtle)] overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-gold opacity-10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="px-6 lg:px-16 py-32 max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-[var(--color-accent-muted)] bg-[var(--color-surface)]/50 backdrop-blur-md mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              Novo Padrão Odontológico
            </span>
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-6 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500">
            Performance &<br />Precisão Absoluta
          </h2>
          <p className="text-lg lg:text-xl text-[var(--color-text-muted)] max-w-2xl mb-12">
            Explore nossa linha completa de implantes Cone Morse, componentes protéticos e instrumentais cirúrgicos com padrão mundial.
          </p>
        </div>
      </div>

      <div className="px-6 lg:px-16 py-24 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-20 -mt-32">
          {cat.map((c) => (
            <Link
              key={c.id}
              to={`/catalogo/${c.id}` as any}
              className="group relative h-[380px] rounded-3xl bg-[var(--color-surface)]/80 backdrop-blur-xl border border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] transition-all overflow-hidden flex flex-col items-center justify-end p-8 no-underline shadow-2xl hover:shadow-[0_20px_50px_rgba(201,166,85,0.15)] hover:-translate-y-2"
            >
              <div className="absolute top-0 inset-x-0 h-1/2 bg-gradient-to-b from-[var(--color-accent-muted)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute top-12 scale-[2.5] opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-[3]">
                {c.icon}
              </div>

              <div className="w-20 h-20 rounded-2xl bg-[var(--color-input-bg)] border border-[var(--color-border-subtle)] flex items-center justify-center mb-6 relative z-10 group-hover:border-[var(--color-accent)] transition-colors shadow-xl">
                {c.icon}
              </div>
              <h3 className="text-3xl font-bold mb-3 text-white relative z-10">{c.title}</h3>
              <p className="text-[var(--color-text-muted)] text-sm relative z-10 group-hover:text-slate-300 transition-colors">{c.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </StoreLayout>
  );
}
