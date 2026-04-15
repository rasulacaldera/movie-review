/** 404 state shown when a movie is not found. */

import { Link } from "react-router-dom";
import { Film } from "lucide-react";

export function NotFoundMessage() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <Film className="h-16 w-16 text-muted-foreground" />
      <h1 className="text-2xl font-bold text-foreground">Movie not found</h1>
      <p className="text-muted-foreground">
        The movie you are looking for does not exist or has been removed.
      </p>
      <Link
        to="/"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Go Home
      </Link>
    </div>
  );
}
