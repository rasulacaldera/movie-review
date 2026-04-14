/** Domain errors for the movies domain. Framework-agnostic. */

export class MovieNotFoundError extends Error {
  constructor(tmdbId: number) {
    super(`Movie with TMDB ID ${tmdbId} not found`);
    this.name = "MovieNotFoundError";
  }
}
