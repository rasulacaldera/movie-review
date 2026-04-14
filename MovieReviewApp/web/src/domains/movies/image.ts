/** Utilities for constructing TMDB image URLs. */

/** Common poster sizes available from TMDB. */
export const POSTER_SIZES = {
  small: "w185",
  medium: "w342",
  large: "w500",
  original: "original",
} as const;

/** Common backdrop sizes available from TMDB. */
export const BACKDROP_SIZES = {
  small: "w300",
  medium: "w780",
  large: "w1280",
  original: "original",
} as const;

/**
 * Builds a full TMDB image URL from a path and size.
 * Returns null if the path is null.
 */
export function buildImageUrl({
  baseUrl,
  path,
  size,
}: {
  baseUrl: string;
  path: string | null;
  size: string;
}): string | null {
  if (path === null) {
    return null;
  }
  return `${baseUrl}${size}${path}`;
}
