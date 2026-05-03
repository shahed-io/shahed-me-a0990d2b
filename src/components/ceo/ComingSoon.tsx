import { Construction, LucideIcon } from "lucide-react";
import { PageHeader } from "./PageHeader";
import { Card } from "@/components/ui/card";

interface Props { title: string; group: string; icon: LucideIcon; description?: string; }

export function ComingSoon({ title, group, icon, description }: Props) {
  return (
    <>
      <PageHeader title={title} subtitle={description ?? `Manage and configure ${title.toLowerCase()}`} breadcrumb={[group, title]} icon={icon} />
      <Card className="flex flex-col items-center justify-center gap-3 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
          <Construction className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">শীঘ্রই আসছে</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          এই section টি active development-এ আছে। পরবর্তী update-এ পূর্ণ functionality পেয়ে যাবেন।
        </p>
      </Card>
    </>
  );
}
