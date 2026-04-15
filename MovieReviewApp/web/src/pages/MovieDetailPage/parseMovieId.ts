/** Parses the route ID param; returns NaN for non-numeric values. */
export function parseMovieId(idParam: string | undefined): number {
  if (!idParam) return NaN;
  const parsed = Number(idParam);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : NaN;
}
