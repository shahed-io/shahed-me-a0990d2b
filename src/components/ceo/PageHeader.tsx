import { LucideIcon } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  breadcrumb?: string[];
  icon: LucideIcon;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, breadcrumb, icon: Icon, actions }: Props) {
  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-border/60 bg-card/60 p-5 shadow-sm backdrop-blur-sm">
      {/* Soft accent glow — kept low-opacity so text stays readable */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{ backgroundImage: "var(--gradient-aurora)" }}
        aria-hidden
      />
      <div className="relative">
        {breadcrumb && (
          <div className="mb-2 flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-2">
                {i > 0 && <span>›</span>}
                <span className={i === breadcrumb.length - 1 ? "text-foreground" : ""}>{b}</span>
              </span>
            ))}
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl text-primary-foreground shadow-lg"
              style={{ backgroundImage: "var(--gradient-primary)" }}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
            </div>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
