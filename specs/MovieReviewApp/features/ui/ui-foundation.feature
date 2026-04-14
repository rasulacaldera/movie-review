Feature: UI Foundation
  As a user
  I want a polished, responsive movie browsing interface
  So that I can discover and navigate movies easily

  # CSS Framework: Tailwind CSS + shadcn/ui (ADR-007)
  # Design tokens from docs/design/guidelines.md
  # Note: guidelines.md examples use Chakra-style syntax — implementation uses
  # Tailwind classes. Guidelines will be updated to match as part of this ticket.
  # Lucide icons per docs/design/components.md
  # React Router for navigation
  # Responsive layout scenarios tagged @e2e — require Playwright (deferred)
  # Testing: jsdom-based tests check component rendering and class presence

  # --- Global Layout ---

  @integration
  Scenario: Page renders with navbar, content area, and footer
    When I visit the home page
    Then I see a navbar at the top
    And I see a main content area
    And I see a footer at the bottom

  @integration
  Scenario: Navbar contains core navigation elements
    When I view the navbar
    Then I see the app logo/title linking to home
    And I see a search input
    And I see navigation links for Home, Coming Soon, and Top Rated
    And I see a Sign In button

  @integration
  Scenario: Navbar navigation links route correctly
    When I click the "Coming Soon" nav link
    Then I am navigated to the coming soon page route

  @integration
  Scenario: Footer displays minimal content
    When I view the footer
    Then I see a copyright notice
    And I see a link to TMDB attribution

  # --- Responsive Layout (require real browser — deferred to Playwright) ---

  @e2e
  Scenario: Layout adapts to mobile viewport
    Given the viewport width is less than 768px
    When I view the page
    Then the navbar collapses to a hamburger menu
    And the content area takes full width

  @e2e
  Scenario: Layout adapts to desktop viewport
    Given the viewport width is 1024px or wider
    When I view the page
    Then the navbar shows all navigation links inline
    And the content area is centered with max width

  # --- Movie Card Component ---

  @integration
  Scenario: Movie card displays core movie info
    Given a movie with title "Inception", year 2010, posterPath "/abc.jpg", and tmdbRating 8.8
    When the movie card renders
    Then I see the movie poster image
    And I see the title "Inception"
    And I see the year "2010"
    And I see the rating badge showing "8.8"

  @integration
  Scenario: Movie card handles missing poster
    Given a movie with posterPath null
    When the movie card renders
    Then I see a placeholder image instead of a broken image

  @integration
  Scenario: Movie card is clickable
    Given a movie card for TMDB ID 550
    When I click the movie card
    Then I am navigated to the movie detail route

  @unit
  Scenario: Movie card renders with correct accessibility
    Given a movie card component
    When it renders
    Then the poster image has an alt text containing the movie title
    And the card has an accessible link

  # --- Star Rating Display ---

  @unit
  Scenario: Star rating displays correct filled stars (half-star granularity)
    Given a rating of 7.5 out of 10
    When the star rating renders
    Then it displays 4 out of 5 stars (rounded to nearest half: 3.75 rounds to 4)
    And the numeric rating "7.5" is displayed

  @unit
  Scenario: Star rating handles zero rating
    Given a rating of 0
    When the star rating renders
    Then all stars are empty
    And the numeric rating "0" is displayed

  @unit
  Scenario: Star rating handles maximum rating
    Given a rating of 10
    When the star rating renders
    Then all 5 stars are fully filled
    And the numeric rating "10" is displayed

  # --- Section Header ---

  @integration
  Scenario: Section header displays title and See All link
    Given a section titled "Popular Movies" with a link to "/movies/popular"
    When the section header renders
    Then I see the heading "Popular Movies"
    And I see a "See All" link pointing to "/movies/popular"

  @integration
  Scenario: Section header without See All link
    Given a section titled "Search Results" with no link
    When the section header renders
    Then I see the heading "Search Results"
    And no "See All" link is shown

  # --- Loading Skeleton ---

  @unit
  Scenario: Skeleton card displays animated placeholders
    When the skeleton card renders
    Then I see animated placeholder elements for poster, title, and rating

  @unit
  Scenario: Skeleton grid renders multiple skeleton cards
    Given a skeleton grid with count 6
    When it renders
    Then I see 6 skeleton cards

  # --- Error and Empty States ---

  @integration
  Scenario: Error state displays message and retry action
    Given an error with message "Failed to load movies"
    When the error state renders
    Then I see an error icon
    And I see the message "Failed to load movies"
    And I see a "Try Again" button

  @integration
  Scenario: Empty state displays message and call to action
    Given an empty state with message "No movies found" and action "Browse Popular"
    When the empty state renders
    Then I see an empty state illustration or icon
    And I see the message "No movies found"
    And I see a "Browse Popular" action button

  # --- Route Stubs ---

  @integration
  Scenario: Stub pages exist for all main routes
    When I navigate to each route
    Then the home page renders at "/"
    And the coming soon page renders at "/coming-soon"
    And the top rated page renders at "/top-rated"
    And the movie detail page renders at "/movie/:id"
    And the search results page renders at "/search"
    And unknown routes show a 404 page
