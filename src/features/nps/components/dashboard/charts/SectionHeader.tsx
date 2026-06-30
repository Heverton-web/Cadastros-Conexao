import { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  id: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  accent?: string;
}

const SectionHeader = ({
  id,
  icon: Icon,
  title,
  subtitle,
  accent = "text-primary",
}: SectionHeaderProps) => {
  return (
    <div id={id} className="scroll-mt-24 flex items-center gap-3 pt-2">
      <div className={`p-2 rounded-lg bg-primary/10 ${accent}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-xl font-bold text-foreground tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>
      </div>
      <div className="hidden md:block flex-1 h-px bg-gradient-to-r from-border/60 to-transparent ml-2" />
    </div>
  );
};

export default SectionHeader;
