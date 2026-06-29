import logo from "~/assets/logo.png";

type Props = { size?: number; className?: string; withText?: boolean };

export function Logo({ size = 40, className = "", withText = false }: Props) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={logo}
        alt="Conexão Implantes"
        width={size}
        height={size}
        className="rounded-lg shadow-md"
        style={{ width: size, height: size }}
      />
      {withText && (
        <div className="leading-tight">
          <p className="text-sm font-bold tracking-tight">Conexão</p>
          <p className="text-xs text-gold font-semibold -mt-0.5">Implantes</p>
        </div>
      )}
    </div>
  );
}
