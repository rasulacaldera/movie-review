Feature: Movie Detail Page
  As a user
  I want to see comprehensive details about a movie
  So that I can decide whether to watch it

  # Data: Fetched via /api/movies/:id, /api/movies/:id/credits,
  #   /api/movies/:id/videos, /api/movies/:id/similar
  # Components: Reuses MovieCard, StarRating, MovieCardSkeleton, ErrorState
  #   from the UI foundation (Issue #3)
  # State: React Query hooks for each data section (detail, credits, videos, similar)
  # Routing: /movie/:id — id is the TMDB movie ID
  # Image: Uses image config for constructing full poster/backdrop/profile URLs.
  #   PROFILE_SIZES constant added to image.ts (following existing POSTER_SIZES pattern).
  # Testing: msw to stub /api/movies/* endpoints in tests
  #
  # Implementation notes:
  # - Frontend types CastMember, MovieCredits, MovieVideo must be added to
  #   web/src/domains/movies/types.ts (they exist on API side, not web side yet)
  # - API functions fetchMovieCredits, fetchMovieVideos, fetchSimilarMovies must
  #   be added to web/src/domains/movies/api.ts
  # - Hooks useMovieDetail, useMovieCredits, useMovieVideos, useSimilarMovies must
  #   be added to web/src/domains/movies/hooks.ts
  # - fetchApi must be extended with a typed ApiError class that exposes the HTTP
  #   status code, so the UI can distinguish 404 from 502 errors
  # - YouTube embeds use youtube-nocookie.com for privacy and lazy-load on click
  #   (thumbnail + play button initially, iframe loads on user interaction)
  # - Videos are filtered client-side to type "Trailer" or "Teaser" only
  #   (the API returns all YouTube video types)
  # - MovieCard.year prop updated to accept number | null (displays "TBA" for null)
  # - Page scrolls to top on route param change (useEffect on id param)
  #
  # Note: "Write Review" and "Add to Watchlist" buttons render but are
  #   non-functional until auth is implemented (future issues)
  # Note: Reviews section is a placeholder — populated in #14

  # --- Hero Section ---

  @integration
  Scenario: Hero section displays movie backdrop, poster, and metadata
    Given the movie detail API returns data for movie 550
    And the image config API returns valid configuration
    When I visit the movie detail page for movie 550
    Then I see the movie backdrop image as a full-width hero background
    And I see the movie poster image
    And I see the movie title
    And I see the release year
    And I see the genre tags
    And I see the runtime formatted as hours and minutes
    And I see the release date

  @integration
  Scenario: Hero section handles zero runtime gracefully
    Given the movie detail API returns a movie with runtime 0
    When I visit the movie detail page
    Then the runtime is not displayed

  @integration
  Scenario: Hero section displays TMDB rating prominently
    Given the movie detail API returns a movie with tmdbRating 8.5
    When I visit the movie detail page
    Then I see the TMDB rating "8.5" displayed prominently
    And I see a star rating visual for the rating

  @integration
  Scenario: Hero section handles missing backdrop gracefully
    Given the movie detail API returns a movie with null backdropPath
    When I visit the movie detail page
    Then the hero section renders with a fallback background
    And the poster and metadata still display correctly

  @integration
  Scenario: Hero section handles missing poster gracefully
    Given the movie detail API returns a movie with null posterPath
    When I visit the movie detail page
    Then a placeholder image displays in place of the poster

  # --- Synopsis ---

  @integration
  Scenario: Synopsis section displays the full movie overview
    Given the movie detail API returns a movie with a synopsis
    When I visit the movie detail page
    Then I see a "Synopsis" heading
    And I see the full movie overview text

  @integration
  Scenario: Synopsis section is hidden when overview is empty
    Given the movie detail API returns a movie with an empty synopsis
    When I visit the movie detail page
    Then the Synopsis section is not rendered

  # --- Cast & Crew ---

  @integration
  Scenario: Cast section displays cast members in a horizontal scroll
    Given the credits API returns a cast of 15 members for movie 550
    When I visit the movie detail page for movie 550
    Then I see a "Cast" heading
    And I see cast cards in a horizontal scrollable container
    And each cast card shows the actor photo, name, and character name

  @integration
  Scenario: Director is highlighted in the crew section
    Given the credits API returns a director "David Fincher" for movie 550
    When I visit the movie detail page for movie 550
    Then I see "Directed by David Fincher" displayed prominently

  @integration
  Scenario: Cast member with missing profile photo shows placeholder
    Given a cast member has a null profilePath
    When the cast card renders
    Then a person placeholder image is shown instead of a broken image

  @integration
  Scenario: Credits section shows message when no cast data available
    Given the credits API returns an empty cast list
    When I visit the movie detail page
    Then I see a message indicating no cast information is available

  # --- Trailers ---

  @integration
  Scenario: Trailers section displays trailer thumbnails with play button
    Given the videos API returns 2 YouTube trailers for movie 550
    When I visit the movie detail page for movie 550
    Then I see a "Trailers" heading
    And I see trailer cards with YouTube thumbnail images and play buttons
    And each trailer card shows the trailer title

  @integration
  Scenario: Clicking play loads the YouTube embed
    Given the videos API returns trailers for movie 550
    When I visit the movie detail page for movie 550
    And I click the play button on a trailer
    Then the thumbnail is replaced with an embedded YouTube player via youtube-nocookie.com

  @integration
  Scenario: Only trailers and teasers are shown (not behind-the-scenes etc.)
    Given the videos API returns videos of types "Trailer", "Teaser", and "Behind the Scenes"
    When I visit the movie detail page
    Then only videos with type "Trailer" or "Teaser" are displayed
    And "Behind the Scenes" videos are not shown

  @integration
  Scenario: Multiple trailers are selectable
    Given the videos API returns 3 YouTube trailers
    When I visit the movie detail page
    Then I see trailer selection options for each trailer
    When I select the second trailer
    Then the active trailer updates to show the second trailer

  @integration
  Scenario: Trailers section is hidden when no trailers or teasers exist
    Given the videos API returns only "Behind the Scenes" videos
    When I visit the movie detail page
    Then the Trailers section is not rendered

  # --- Similar Movies ---

  @integration
  Scenario: Similar movies section displays a carousel of movie cards
    Given the similar movies API returns 10 results for movie 550
    When I visit the movie detail page for movie 550
    Then I see a "Similar Movies" heading
    And I see movie cards in a horizontal scrollable container
    And each card shows poster, title, year, and rating

  @integration
  Scenario: Clicking a similar movie navigates to its detail page
    Given the similar movies section is displaying results
    When I click on a similar movie card
    Then I am navigated to the movie detail page for that movie
    And the page scrolls to the top

  @integration
  Scenario: Similar movies section is hidden when no results
    Given the similar movies API returns an empty list
    When I visit the movie detail page
    Then the Similar Movies section is not rendered

  # --- Reviews Placeholder ---

  @integration
  Scenario: Reviews section shows placeholder
    When I visit the movie detail page
    Then I see a "Reviews" heading
    And I see a placeholder message indicating reviews are coming soon

  # --- Action Buttons ---

  @integration
  Scenario: Action buttons render in disabled/placeholder state
    When I visit the movie detail page
    Then I see an "Add to Watchlist" button
    And I see a "Write Review" button
    And the buttons are visually present but indicate auth is required

  # --- Loading State ---

  @integration
  Scenario: Page shows loading skeletons while fetching data
    Given the API is slow to respond
    When I visit the movie detail page
    Then I see a skeleton placeholder for the hero section
    And I see skeleton placeholders for the cast section
    And I see a skeleton placeholder for the synopsis

  @integration
  Scenario: Each section loads independently
    Given the movie detail API responds quickly
    And the credits API is slow to respond
    When I visit the movie detail page
    Then the hero section and synopsis render with data
    And the cast section still shows a loading skeleton

  # --- Error Handling ---

  @integration
  Scenario: Page shows error state when movie detail API fails
    Given the movie detail API returns a 502 error
    When I visit the movie detail page
    Then I see an error state with a retry button
    When I click "Try Again"
    Then the page attempts to refetch the movie data

  @integration
  Scenario: Page shows not found for invalid movie ID
    Given the movie detail API returns a 404 error
    When I visit the movie detail page
    Then I see a "Movie not found" message
    And I see a link to go back to the home page

  @integration
  Scenario: Page shows not found for non-numeric route parameter
    When I visit "/movie/abc"
    Then I see a "Movie not found" message
    And no API call is made

  @integration
  Scenario: Individual sections fail gracefully
    Given the movie detail API succeeds
    And the credits API returns a 502 error
    When I visit the movie detail page
    Then the hero and synopsis sections render normally
    And the cast section shows an error state with a retry button

  # --- Responsive Layout ---

  @e2e
  Scenario: Desktop layout shows poster beside movie info
    Given the viewport width is 1024px or wider
    When I visit the movie detail page
    Then the poster displays to the left of the movie info
    And the layout is side-by-side

  @e2e
  Scenario: Mobile layout stacks poster above movie info
    Given the viewport width is less than 768px
    When I visit the movie detail page
    Then the poster displays above the movie info
    And the layout is vertically stacked

  # --- SEO ---

  @integration
  Scenario: Page title reflects the movie name
    Given the movie detail API returns a movie titled "Fight Club"
    When I visit the movie detail page
    Then the document title contains "Fight Club"

  # --- Data Fetching Hooks ---

  @unit
  Scenario: useMovieDetail hook fetches and returns movie data
    Given a useMovieDetail hook for movie ID 550
    When the hook is called
    Then it returns isLoading true initially
    And it returns the MovieDetail data when the request succeeds
    And it returns error when the request fails

  @unit
  Scenario: useMovieCredits hook fetches and returns credits
    Given a useMovieCredits hook for movie ID 550
    When the hook is called
    Then it returns the cast array and director when successful

  @unit
  Scenario: useMovieVideos hook fetches and returns trailers and teasers only
    Given a useMovieVideos hook for movie ID 550
    When the hook is called
    Then it returns only videos with type "Trailer" or "Teaser"
    And "Behind the Scenes" and other types are excluded

  @unit
  Scenario: useSimilarMovies hook fetches and returns similar movies
    Given a useSimilarMovies hook for movie ID 550
    When the hook is called
    Then it returns a paginated list of similar MovieSummary items

  @unit
  Scenario: API functions construct correct endpoint URLs
    When fetchMovieCredits is called with ID 550
    Then it calls /api/movies/550/credits
    When fetchMovieVideos is called with ID 550
    Then it calls /api/movies/550/videos
    When fetchSimilarMovies is called with ID 550
    Then it calls /api/movies/550/similar
