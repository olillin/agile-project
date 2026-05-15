import { PageShell } from "@/components/admin/PageShell";
import { MealsBrowser } from "@/components/admin/sections/MealsBrowser";
import { buttonClassName } from "@/components/ui/Button";
import { getAdminMealCatalog } from "@/services/statisticsService";
import Link from "next/link";

export default async function AdminMealsPage() {
  const meals = await getAdminMealCatalog();

  return (
    <PageShell
      title="Meals"
      subtitle="Your full catalog · search, browse, and schedule"
      actions={
        <Link href="/admin/meals/new" className={buttonClassName(true)}>
          + New meal
        </Link>
      }
    >
      <MealsBrowser meals={meals} />
    </PageShell>
  );
}
