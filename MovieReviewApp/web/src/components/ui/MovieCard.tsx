import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import { cn } from "~/lib/utils.js";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface MovieCardProps {
  /** TMDB movie ID. */
  tmdbId: number;
  /** Movie title. */
  title: string;
  /** Release year. */
  year: number;
  /** TMDB poster path (e.g. "/abc.jpg"), or null if no poster. */
  posterPath: string | null;
  /** TMDB average rating (0-10). */
  tmdbRating: number;
}

/** Card displaying a movie poster, title, year, and rating badge. Links to movie detail. */
export function MovieCard({ tmdbId, title, year, posterPath, tmdbRating }: MovieCardProps) {
  return (
    <Link
      to={`/movie/${tmdbId}`}
      className={cn(
        "group block overflow-hidden rounded-lg bg-card transition-transform hover:scale-[1.02]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      aria-label={`${title} (${year})`}
    >
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-t-lg bg-muted">
        {posterPath ? (
          <img
            src={`${TMDB_IMAGE_BASE}${posterPath}`}
            alt={`${title} poster`}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center bg-muted"
            role="img"
            aria-label={`${title} poster placeholder`}
          >
            <Film className="h-12 w-12 text-muted-foreground" />
          </div>
        )}
        <div className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-0.5 text-xs font-bold text-rating backdrop-blur-sm">
          {tmdbRating.toFixed(1)}
        </div>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-semibold text-foreground group-hover:text-primary">
          {title}
        </h3>
        <p className="text-xs text-muted-foreground">{year}</p>
      </div>
    </Link>
  );
}
