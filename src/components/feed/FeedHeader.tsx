import Link from "next/link";
import { Wordmark } from "@/components/brand/Wordmark";
import { FOCUS_RING } from "@/lib/styles";

export function FeedHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper supports-[backdrop-filter]:bg-paper/70 backdrop-blur-md pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex h-14 max-w-screen-sm items-center px-4">
        <Link
          href="/"
          aria-label="Don't Spill the Tea — home"
          className={`rounded-sm ${FOCUS_RING.paper}`}
        >
          <Wordmark size={20} />
        </Link>
      </div>
    </header>
  );
}
