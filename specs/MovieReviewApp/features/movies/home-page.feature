Feature: Home Page with Movie Sections
  As a user
  I want to see curated movie sections on the home page
  So that I can discover movies to watch

  # Data: All movie data fetched from TMDB API via /api/movies/* endpoints
  # Components: Reuses MovieCard, StarRating, SectionHeader, MovieCardSkeleton,
  #   ErrorState from the UI foundation (Issue #3)
  # State: React Query for server-state management
  # Testing: msw to stub /api/movies/* endpoints in tests

  # --- Hero Banner ---

  @integration
  Scenario: Hero banner displays a featured movie
    Given the popular movies API returns results
    When I visit the home page
    Then I see a hero banner with the first popular movie
    And the banner shows the movie backdrop image
    And the banner shows the movie title
    And the banner shows the movie rating
    And the banner has a "View Details" link to the movie detail page

  @integration
  Scenario: Hero banner shows skeleton while loading
    Given the API is slow to respond
    When I visit the home page
    Then I see a hero banner skeleton placeholder

  # --- Now Playing Section ---

  @integration
  Scenario: Now Playing section displays movies in a horizontal carousel
    Given the now playing API returns 20 movies
    When I visit the home page
    Then I see a "Now Playing" section header with a "See All" link
    And I see movie cards in a horizontal scrollable container
    And each card shows poster, title, year, and rating

  @integration
  Scenario: Now Playing section shows skeletons while loading
    Given the now playing API has not responded yet
    When I visit the home page
    Then I see skeleton cards in the Now Playing section

  # --- Coming Soon Section ---

  @integration
  Scenario: Coming Soon section displays upcoming movies
    Given the upcoming movies API returns results
    When I visit the home page
    Then I see a "Coming Soon" section header with a "See All" link
    And I see movie cards in a horizontal scrollable container
    And each card shows the release date

  # --- Popular Section ---

  @integration
  Scenario: Popular section displays movies in a grid
    Given the popular movies API returns results
    When I visit the home page
    Then I see a "Popular" section header with a "See All" link
    And I see movie cards in a responsive grid layout

  # --- Top Rated Section ---

  @integration
  Scenario: Top Rated section displays movies in a grid
    Given the top rated movies API returns results
    When I visit the home page
    Then I see a "Top Rated" section header with a "See All" link
    And I see movie cards in a responsive grid layout

  # --- Navigation ---

  @integration
  Scenario: Clicking a movie card navigates to movie detail
    Given the home page has loaded with movies
    When I click on a movie card
    Then I am navigated to the movie detail page for that movie

  @integration
  Scenario: See All links navigate to listing pages
    Given the home page has loaded
    When I click "See All" on the Now Playing section
    Then I am navigated to the now playing listing route

  # --- Error Handling ---

  @integration
  Scenario: Section shows error state when API fails
    Given the popular movies API returns a 502 error
    When I visit the home page
    Then the Popular section shows an error state with a retry button
    And other sections that succeeded still display their movies

  @integration
  Scenario: Retry button refetches the failed section
    Given the Popular section is showing an error state
    When I click the "Try Again" button
    Then the section attempts to refetch the data

  # --- Data Fetching ---

  @unit
  Scenario: Each section fetches data independently
    When the home page loads
    Then it makes 4 parallel API requests
    And each section renders as its data arrives (no waterfall)

  @unit
  Scenario: API hook returns loading, error, and data states
    Given a useMovies hook for the popular endpoint
    When the hook is called
    Then it returns isLoading true initially
    And it returns data when the request succeeds
    And it returns error when the request fails
