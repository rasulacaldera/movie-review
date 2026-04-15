/** Disabled action buttons for watchlist and review (require auth). */

import { Bookmark, PenLine } from "lucide-react";

export function ActionButtons() {
  return (
    <div className="flex gap-3 px-4">
      <button
        type="button"
        disabled
        className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2.5 text-sm font-medium text-primary opacity-60"
        title="Sign in to add to watchlist"
      >
        <Bookmark className="h-4 w-4" />
        Add to Watchlist
      </button>
      <button
        type="button"
        disabled
        className="flex items-center gap-2 rounded-lg bg-primary/20 px-4 py-2.5 text-sm font-medium text-primary opacity-60"
        title="Sign in to write a review"
      >
        <PenLine className="h-4 w-4" />
        Write Review
      </button>
    </div>
  );
}
