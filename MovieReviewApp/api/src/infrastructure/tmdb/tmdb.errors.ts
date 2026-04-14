/** Infrastructure-level errors for the TMDB gateway. */

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

export class TmdbNotFoundError extends Error {
  constructor(message = "TMDB resource not found") {
    super(message);
    this.name = "TmdbNotFoundError";
  }
}
