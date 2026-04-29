import { Button } from "@/components/admin/Button";
import { PageShell } from "@/components/admin/PageShell";
import { MealsBrowser } from "@/components/admin/sections/MealsBrowser";
import { MEALS } from "@/lib/admin/fixtures";

export default function AdminMealsPage() {
  return (
    <PageShell
      title="Meals"
      subtitle="Your full catalog · search, browse, and schedule"
      actions={<Button primary>+ New meal</Button>}
    >
      <MealsBrowser meals={MEALS} />
    </PageShell>
  );
}
