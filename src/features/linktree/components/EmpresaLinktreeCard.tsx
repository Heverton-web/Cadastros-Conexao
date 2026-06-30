import { ExternalLink, Star } from "lucide-react";
import type { EmpresaLinktreeLink, EmpresaLinktreeSection, EmpresaLinktreeTheme } from "../types-empresa";
import { DynamicIcon } from "./DynamicIcon";

interface Props {
  sections: EmpresaLinktreeSection[];
  links: EmpresaLinktreeLink[];
  theme: EmpresaLinktreeTheme;
  bio?: string | null;
  bannerUrl?: string | null;
  empresaNome?: string;
  onLinkClick?: (link: EmpresaLinktreeLink) => void;
}

function bgStyle(theme: EmpresaLinktreeTheme): React.CSSProperties {
  const b = theme.background;
  if (b.mode === "solid") return { background: b.solid };
  if (b.mode === "gradient3") {
    return { background: `linear-gradient(${b.gradient3Angle}deg, ${b.gradient3From}, ${b.gradient3Mid}, ${b.gradient3To})` };
  }
  return { background: `linear-gradient(${b.gradientAngle}deg, ${b.gradientFrom}, ${b.gradientTo})` };
}

function buttonStyle(theme: EmpresaLinktreeTheme): React.CSSProperties {
  const btn = theme.buttons;
  const radius = btn.style === "pill" ? 9999 : btn.style === "square" ? 4 : btn.borderRadius;
  return {
    background: btn.bgColor,
    color: btn.textColor,
    borderRadius: radius,
    boxShadow: btn.shadow ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
  };
}

export function EmpresaLinktreeCard({ sections, links, theme, bio, bannerUrl, empresaNome, onLinkClick }: Props) {
  const linksBySection = new Map<string, EmpresaLinktreeLink[]>();
  for (const link of links) {
    const arr = linksBySection.get(link.section_id) ?? [];
    arr.push(link);
    linksBySection.set(link.section_id, arr);
  }

  return (
    <div
      className="relative flex min-h-[100svh] w-full justify-center overflow-hidden"
      style={bgStyle(theme)}
    >
      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(2.25rem,env(safe-area-inset-top))]">
        {bannerUrl && (
          <div className="mb-4 w-full overflow-hidden rounded-xl">
            <img src={bannerUrl} alt="Banner" className="h-40 w-full object-cover" />
          </div>
        )}

        {empresaNome && (
          <h1
            className="text-balance text-center text-2xl font-bold leading-tight"
            style={{ fontFamily: theme.typography.font, color: theme.typography.titleColor }}
          >
            {empresaNome}
          </h1>
        )}

        {bio && (
          <p
            className="mt-2 text-center text-sm leading-relaxed opacity-80"
            style={{ fontFamily: theme.typography.font, color: theme.typography.bioColor }}
          >
            {bio}
          </p>
        )}

        <div className="mt-6 w-full space-y-8">
          {sections.map((section) => {
            const sectionLinks = linksBySection.get(section.id) ?? [];
            if (sectionLinks.length === 0) return null;

            return (
              <div key={section.id}>
                <h2
                  className="mb-3 text-xs font-semibold uppercase tracking-wider opacity-60"
                  style={{ fontFamily: theme.typography.font, color: theme.typography.bioColor }}
                >
                  {section.titulo}
                </h2>
                <div className="space-y-3">
                  {sectionLinks.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => onLinkClick?.(link)}
                      className="group flex w-full items-center gap-3 px-4 py-3 transition active:scale-[0.99]"
                      style={{
                        ...buttonStyle(theme),
                        fontFamily: theme.typography.font,
                      }}
                    >
                      {link.icone && (
                        <span className="text-lg">
                          {link.icone.startsWith("http") ? (
                            <img src={link.icone} alt="" className="size-5" />
                          ) : (
                            <DynamicIcon name={link.icone} size={20} />
                          )}
                        </span>
                      )}
                      <span className="flex-1 truncate text-sm font-medium">{link.titulo}</span>
                      {link.destaque && <Star className="size-4 shrink-0 fill-current opacity-60" />}
                      <ExternalLink className="size-4 shrink-0 opacity-40" />
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
