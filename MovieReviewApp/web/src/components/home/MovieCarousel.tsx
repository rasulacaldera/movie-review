/** Horizontal scrollable carousel of MovieCards with scroll-snap. */

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "~/components/ui/MovieCard.js";
import type { MovieSummary } from "~/domains/movies/types.js";

interface MovieCarouselProps {
  /** Movies to display in the carousel. */
  movies: MovieSummary[];
}

/** Horizontal scroll container with snap alignment and optional scroll buttons. */
export function MovieCarousel({ movies }: MovieCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    const scrollAmount = scrollRef.current.clientWidth * 0.75;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <div className="group/carousel relative">
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 scrollbar-hide"
        data-testid="movie-carousel"
      >
        {movies.map((movie) => (
          <div
            key={movie.tmdbId}
            className="w-[160px] flex-shrink-0 snap-start sm:w-[180px] md:w-[200px]"
          >
            <MovieCard
              tmdbId={movie.tmdbId}
              title={movie.title}
              year={movie.year ?? 0}
              posterPath={movie.posterPath}
              tmdbRating={movie.tmdbRating}
            />
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-sm hover:bg-background group-hover/carousel:block"
        aria-label="Scroll left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-md backdrop-blur-sm hover:bg-background group-hover/carousel:block"
        aria-label="Scroll right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
