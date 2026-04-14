/** Domain errors for the movies domain. Framework-agnostic. */

export class MovieNotFoundError extends Error {
  constructor(tmdbId: number) {
    super(`Movie with TMDB ID ${tmdbId} not found`);
    this.name = "MovieNotFoundError";
  }
}

export class TmdbUnavailableError extends Error {
  constructor(message = "TMDB API is unavailable") {
    super(message);
    this.name = "TmdbUnavailableError";
  }
}

export class TmdbTimeoutError extends Error {
  constructor(message = "TMDB API request timed out") {
    super(message);
    this.name = "TmdbTimeoutError";
  }
}

export class TmdbMalformedResponseError extends Error {
  constructor(message = "TMDB API returned a malformed response") {
    super(message);
    this.name = "TmdbMalformedResponseError";
  }
}
