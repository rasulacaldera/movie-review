Feature: TMDB API Integration
  As a user
  I want to browse movie data from TMDB
  So that I can discover movies to watch and review

  # Architecture: TMDB is modeled as a Gateway (infrastructure adapter),
  # not a Repository. See ADR-006 for rationale.
  #
  # Data ownership: TMDB is the sole data source for this ticket.
  # Local review merging will be added in #13/#14 when reviews exist.
  #
  # Image strategy: Backend returns posterPath/backdropPath as relative paths.
  # Frontend constructs full URL with desired size (w200, w500, original).
  # Image config endpoint provides base URL and available sizes.
  #
  # Testing: All @integration tests use msw (Mock Service Worker) to stub
  # TMDB responses. No live TMDB calls in tests. See TESTING_PHILOSOPHY.md.
  #
  # Caching/rate-limiting: Deferred — not in scope for this ticket.

  Background:
    Given the TMDB API is configured with a valid API key

  # --- Movie Listings ---

  @integration
  Scenario: Fetch now playing movies
    When I request now playing movies
    Then I receive a paginated list of movies currently in theaters
    And each movie has tmdbId, title, year, posterPath, and rating
    And the response includes page, totalPages, and totalResults

  @integration
  Scenario: Fetch upcoming movies
    When I request upcoming movies
    Then I receive a paginated list of movies with future release dates
    And each movie has tmdbId, title, year, posterPath, releaseDate, and rating

  @integration
  Scenario: Fetch popular movies
    When I request popular movies
    Then I receive a paginated list of trending movies
    And each movie has tmdbId, title, year, posterPath, and rating

  @integration
  Scenario: Fetch top rated movies
    When I request top rated movies
    Then I receive a paginated list of highest rated movies
    And each movie has tmdbId, title, year, posterPath, and rating

  @integration
  Scenario: Paginate movie listings
    When I request popular movies page 2
    Then I receive the second page of results
    And the response includes page number and total pages

  @integration
  Scenario: Request out-of-range page
    When I request popular movies page 9999
    Then I receive an empty results list
    And page and totalPages are still returned

  # --- Movie Details ---

  @integration
  Scenario: Fetch movie details
    Given a movie with TMDB ID 550 exists
    When I request details for movie 550
    Then I receive the full movie details from TMDB
    And the response includes title, year, synopsis, genres, runtime, releaseDate, posterPath, backdropPath, and tmdbRating

  @integration
  Scenario: Fetch movie credits
    Given a movie with TMDB ID 550 exists
    When I request credits for movie 550
    Then I receive the cast list with name, character, and profilePath
    And I receive the director name

  @integration
  Scenario: Fetch movie videos
    Given a movie with TMDB ID 550 exists
    When I request videos for movie 550
    Then I receive a list of trailers filtered to YouTube only
    And each trailer has name, youtubeKey, and type

  @integration
  Scenario: Fetch similar movies
    Given a movie with TMDB ID 550 exists
    When I request similar movies for movie 550
    Then I receive a list of related movies
    And each movie has tmdbId, title, year, posterPath, and rating

  # --- Search ---

  @integration
  Scenario: Search movies by title
    When I search for movies with query "inception"
    Then I receive a paginated list of matching movies
    And each movie has tmdbId, title, year, posterPath, and rating

  @integration
  Scenario: Search with empty query
    When I search for movies with query ""
    Then I receive a 400 validation error

  @integration
  Scenario: Search with pagination
    When I search for movies with query "the" on page 2
    Then I receive the second page of search results

  # --- Image Configuration ---

  @integration
  Scenario: Fetch image configuration
    When I request the image configuration
    Then I receive the TMDB image base URL
    And I receive the list of available poster sizes
    And I receive the list of available backdrop sizes

  # --- Error Handling ---

  @integration
  Scenario: Request details for non-existent movie
    When I request details for movie 999999999
    Then I receive a 404 not found error

  @integration
  Scenario: Handle TMDB API being unavailable
    Given the TMDB API is unreachable
    When I request popular movies
    Then I receive a 502 bad gateway error
    And the error message indicates an upstream service failure

  @integration
  Scenario: Handle TMDB request timeout
    Given the TMDB API takes longer than 5 seconds to respond
    When I request popular movies
    Then I receive a 504 gateway timeout error

  @integration
  Scenario: Handle malformed TMDB response
    Given the TMDB API returns invalid JSON
    When I request popular movies
    Then I receive a 502 bad gateway error
    And the error is logged with parsing details

  # --- Domain Type Normalization ---

  @unit
  Scenario: Normalize TMDB movie list response to domain type
    Given a raw TMDB movie response with snake_case fields
    When the response is normalized
    Then the result uses camelCase domain types
    And poster_path is kept as a relative path
    And vote_average is mapped to rating
    And release_date is mapped to releaseDate
    And genre_ids are mapped to genre names

  @unit
  Scenario: Normalize TMDB movie detail response to domain type
    Given a raw TMDB movie detail response
    When the response is normalized
    Then backdrop_path is kept as a relative path
    And runtime is preserved as minutes
    And genres array contains name strings
    And overview is mapped to synopsis

  @unit
  Scenario: Handle missing optional fields gracefully
    Given a TMDB movie response with null poster_path and null backdrop_path
    When the response is normalized
    Then posterPath and backdropPath are null
    And no error is thrown

  @unit
  Scenario: Normalize credits response
    Given a raw TMDB credits response
    When the response is normalized
    Then cast members have name, character, and profilePath
    And the director is extracted from the crew list

  # --- Configuration ---

  @unit
  Scenario: Validate TMDB API key is configured
    Given the TMDB_API_KEY environment variable is not set
    When the application starts
    Then it fails with a configuration error mentioning TMDB_API_KEY

  @unit
  Scenario: TMDB base URL is configurable
    Given TMDB_BASE_URL is set to a custom URL
    When the gateway makes requests
    Then it uses the custom base URL
