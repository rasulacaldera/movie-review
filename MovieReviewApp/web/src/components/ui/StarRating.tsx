import { Star, StarHalf } from "lucide-react";
import { cn } from "~/lib/utils.js";

interface StarRatingProps {
  /** Rating on a 0-10 scale. */
  rating: number;
  /** Maximum number of stars to display. Defaults to 5. */
  maxStars?: number;
}

/**
 * Displays a star rating with half-star granularity.
 * Converts a 0-10 rating scale to 0-maxStars stars.
 */
export function StarRating({ rating, maxStars = 5 }: StarRatingProps) {
  const scaledRating = (rating / 10) * maxStars;
  const roundedRating = Math.round(scaledRating * 2) / 2;

  const stars = Array.from({ length: maxStars }, (_, i) => {
    const starIndex = i + 1;
    if (roundedRating >= starIndex) {
      return "full" as const;
    }
    if (roundedRating >= starIndex - 0.5) {
      return "half" as const;
    }
    return "empty" as const;
  });

  return (
    <div className="flex items-center gap-1" aria-label={`Rating: ${rating} out of 10`}>
      <div className="flex">
        {stars.map((type, i) => (
          <span key={i} data-testid={`star-${type}`}>
            {type === "full" && (
              <Star className={cn("h-4 w-4 fill-rating text-rating")} />
            )}
            {type === "half" && (
              <StarHalf className={cn("h-4 w-4 fill-rating text-rating")} />
            )}
            {type === "empty" && (
              <Star className={cn("h-4 w-4 text-muted-foreground")} />
            )}
          </span>
        ))}
      </div>
      <span className="text-sm font-medium text-foreground">{rating}</span>
    </div>
  );
}
