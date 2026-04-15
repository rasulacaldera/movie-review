/** Trailer section with YouTube embed player and tab selection. */

import { useState } from "react";
import { Play } from "lucide-react";
import type { MovieVideo } from "~/domains/movies/types.js";

export interface TrailerSectionProps {
  trailers: MovieVideo[];
  isLoading: boolean;
  isError: boolean;
}

export function TrailerSection({
  trailers,
  isLoading,
  isError,
}: TrailerSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  if (isLoading) return null;
  if (isError) return null;
  if (trailers.length === 0) return null;

  const activeTrailer = trailers[activeIndex] ?? trailers[0];
  if (!activeTrailer) return null;

  return (
    <section className="px-4" data-testid="trailers-section">
      <h2 className="mb-3 text-xl font-bold text-foreground">Trailers</h2>

      {/* Active trailer player area */}
      <div
        role="tabpanel"
        id="trailer-player"
        className="relative mb-4 aspect-video w-full max-w-3xl overflow-hidden rounded-lg bg-black"
      >
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${activeTrailer.youtubeKey}?autoplay=1`}
            title={activeTrailer.name}
            className="h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${activeTrailer.youtubeKey}/hqdefault.jpg`}
              alt={`${activeTrailer.name} thumbnail`}
              className="h-full w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
              aria-label={`Play ${activeTrailer.name}`}
            >
              <div className="rounded-full bg-primary p-4">
                <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
              </div>
            </button>
          </>
        )}
      </div>

      {/* Trailer selection */}
      {trailers.length > 1 && (
        <div
          role="tablist"
          aria-label="Trailer selection"
          className="flex gap-2 overflow-x-auto pb-2"
        >
          {trailers.map((trailer, index) => (
            <button
              key={trailer.youtubeKey}
              type="button"
              onClick={() => {
                setActiveIndex(index);
                setPlaying(false);
              }}
              className={`flex-shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                index === activeIndex
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
              aria-selected={index === activeIndex}
              role="tab"
            >
              {trailer.name}
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
