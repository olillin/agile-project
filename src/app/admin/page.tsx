import { Button } from "@/components/admin/Button";
import { Card } from "@/components/admin/Card";
import { PageShell } from "@/components/admin/PageShell";
import { KpiStrip } from "@/components/admin/sections/KpiStrip";
import { RankedMeals } from "@/components/admin/sections/RankedMeals";
import { TrendCard } from "@/components/admin/sections/TrendCard";
import { KPIS, MANAGER, MEALS } from "@/lib/admin/fixtures";

function formatToday() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function AdminOverviewPage() {
  return (
    <PageShell
      title={
        <>
          Good morning,{" "}
          <span className="text-amber italic">{MANAGER.firstName}</span>
        </>
      }
      subtitle={formatToday()}
      actions={<Button primary>+ New meal</Button>}
    >
      <KpiStrip kpis={KPIS} />
      <Card style={{ marginBottom: 16 }}>
        <RankedMeals meals={MEALS} />
      </Card>
      <TrendCard />
    </PageShell>
  );
}
