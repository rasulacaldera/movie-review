import { AlertCircle } from "lucide-react";

interface ErrorStateProps {
  /** Error message to display. */
  message: string;
  /** Optional retry callback. When provided, a "Try Again" button is shown. */
  onRetry?: () => void;
}

/** Displays an error message with an icon and optional retry action. */
export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-12 text-center">
      <AlertCircle
        className="h-10 w-10 text-destructive"
        data-testid="error-icon"
      />
      <p className="text-sm font-medium text-foreground">{message}</p>
      {onRetry !== undefined && (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
