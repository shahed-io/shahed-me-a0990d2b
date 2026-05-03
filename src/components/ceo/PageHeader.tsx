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
    <div className="mb-6 rounded-2xl border bg-gradient-to-r from-primary/5 via-background to-purple-500/5 p-5 shadow-sm">
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
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-purple-500 text-white shadow-md">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-2xl font-bold text-transparent">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
