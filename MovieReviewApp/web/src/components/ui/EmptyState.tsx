import { Link } from "react-router-dom";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
  /** Message to display. */
  message: string;
  /** Optional CTA button label. */
  actionLabel?: string;
  /** Optional CTA link href. */
  actionHref?: string;
}

/** Displays an empty state with an icon, message, and optional call to action. */
export function EmptyState({ message, actionLabel, actionHref }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <Inbox className="h-10 w-10 text-muted-foreground" data-testid="empty-icon" />
      <p className="text-sm font-medium text-foreground">{message}</p>
      {actionLabel !== undefined && actionHref !== undefined && (
        <Link
          to={actionHref}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
