import { PageShell } from "@/components/admin/PageShell";
import { SuggestionsBrowser } from "@/components/admin/sections/SuggestionsBrowser";
import { SUGGESTIONS } from "@/lib/admin/fixtures";

export default function AdminMealsPage() {
  // TODO: Fetch real data
  return (
    <PageShell title="Suggestions" subtitle="Meal suggestions left by students">
      <SuggestionsBrowser suggestions={SUGGESTIONS} />
    </PageShell>
  );
}
