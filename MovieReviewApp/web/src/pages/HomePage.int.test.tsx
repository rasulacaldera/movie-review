import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import HomePage from "~/pages/HomePage.js";
import type { MovieSummary, PaginatedResult, ImageConfiguration } from "~/domains/movies/types.js";

// --- Test data ---

function makeMovie(overrides: Partial<MovieSummary> = {}): MovieSummary {
  return {
    tmdbId: 550,
    title: "Fight Club",
    year: 1999,
    posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    tmdbRating: 8.4,
    releaseDate: "1999-10-15",
    genres: ["Drama"],
    ...overrides,
  };
}

function makePaginatedResult(
  movies: MovieSummary[],
): PaginatedResult<MovieSummary> {
  return {
    results: movies,
    page: 1,
    totalPages: 5,
    totalResults: 100,
  };
}

const popularMovies = [
  makeMovie({ tmdbId: 1, title: "Inception", year: 2010, tmdbRating: 8.8 }),
  makeMovie({ tmdbId: 2, title: "The Matrix", year: 1999, tmdbRating: 8.7 }),
  makeMovie({ tmdbId: 3, title: "Interstellar", year: 2014, tmdbRating: 8.6 }),
];

const nowPlayingMovies = [
  makeMovie({ tmdbId: 10, title: "Dune Part Two", year: 2024, tmdbRating: 8.2 }),
  makeMovie({ tmdbId: 11, title: "Oppenheimer", year: 2023, tmdbRating: 8.5 }),
];

const upcomingMovies = [
  makeMovie({
    tmdbId: 20,
    title: "Avatar 3",
    year: 2025,
    releaseDate: "2025-12-19",
    tmdbRating: 0,
  }),
  makeMovie({
    tmdbId: 21,
    title: "Mission Impossible 8",
    year: 2025,
    releaseDate: "2025-05-23",
    tmdbRating: 0,
  }),
];

const topRatedMovies = [
  makeMovie({ tmdbId: 30, title: "The Shawshank Redemption", year: 1994, tmdbRating: 9.3 }),
  makeMovie({ tmdbId: 31, title: "The Godfather", year: 1972, tmdbRating: 9.2 }),
];

const imageConfig: ImageConfiguration = {
  baseUrl: "https://image.tmdb.org/t/p/",
  posterSizes: ["w185", "w342", "w500"],
  backdropSizes: ["w300", "w780", "w1280"],
};

// --- MSW server ---

const handlers = [
  http.get("/api/movies/popular", () =>
    HttpResponse.json(makePaginatedResult(popularMovies)),
  ),
  http.get("/api/movies/now-playing", () =>
    HttpResponse.json(makePaginatedResult(nowPlayingMovies)),
  ),
  http.get("/api/movies/upcoming", () =>
    HttpResponse.json(makePaginatedResult(upcomingMovies)),
  ),
  http.get("/api/movies/top-rated", () =>
    HttpResponse.json(makePaginatedResult(topRatedMovies)),
  ),
  http.get("/api/movies/configuration", () =>
    HttpResponse.json(imageConfig),
  ),
];

const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// --- Render helper ---

function renderHomePage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/movie/:id",
        element: <div>Movie Detail Page</div>,
      },
      {
        path: "/now-playing",
        element: <div>Now Playing Page</div>,
      },
      {
        path: "/coming-soon",
        element: <div>Coming Soon Page</div>,
      },
      {
        path: "/popular",
        element: <div>Popular Page</div>,
      },
      {
        path: "/top-rated",
        element: <div>Top Rated Page</div>,
      },
    ],
    { initialEntries: ["/"] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

// --- Tests ---

describe("<HomePage/>", () => {
  describe("when all APIs return successfully", () => {
    it("renders the hero banner with the first popular movie", async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
      });

      const banner = screen.getByTestId("hero-banner");
      expect(within(banner).getByText("Inception")).toBeInTheDocument();
    });

    it("renders the hero banner backdrop image", async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
      });

      expect(screen.getByAltText("Inception backdrop")).toBeInTheDocument();
    });

    it("renders the hero banner rating", async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
      });

      const banner = screen.getByTestId("hero-banner");
      expect(
        within(banner).getByRole("img", { name: /Rating: 8.8 out of 10/ }),
      ).toBeInTheDocument();
    });

    it("renders a View Details link in the hero banner", async () => {
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByTestId("hero-banner")).toBeInTheDocument();
      });

      const link = within(screen.getByTestId("hero-banner")).getByRole("link", {
        name: "View Details",
      });
      expect(link).toHaveAttribute("href", "/movie/1");
    });

    it("renders the Now Playing section with movie cards", async () => {
      renderHomePage();

      await waitFor(() => {
        const section = screen.getByTestId("section-now-playing");
        expect(within(section).getByText("Dune Part Two")).toBeInTheDocument();
      });

      const section = screen.getByTestId("section-now-playing");
      expect(within(section).getByText("Now Playing")).toBeInTheDocument();
      expect(within(section).getByText("Oppenheimer")).toBeInTheDocument();
    });

    it("renders the Coming Soon section with movie cards", async () => {
      renderHomePage();

      await waitFor(() => {
        const section = screen.getByTestId("section-coming-soon");
        expect(within(section).getByText("Avatar 3")).toBeInTheDocument();
      });

      const section = screen.getByTestId("section-coming-soon");
      expect(within(section).getByText("Coming Soon")).toBeInTheDocument();
    });

    it("renders the Popular section with movie cards in a grid", async () => {
      renderHomePage();

      await waitFor(() => {
        const section = screen.getByTestId("section-popular");
        expect(within(section).getByText("Inception")).toBeInTheDocument();
      });

      const section = screen.getByTestId("section-popular");
      expect(within(section).getByText("Popular")).toBeInTheDocument();
      expect(within(section).getByTestId("movie-grid")).toBeInTheDocument();
    });

    it("renders the Top Rated section with movie cards in a grid", async () => {
      renderHomePage();

      await waitFor(() => {
        const section = screen.getByTestId("section-top-rated");
        expect(
          within(section).getByText("The Shawshank Redemption"),
        ).toBeInTheDocument();
      });

      const section = screen.getByTestId("section-top-rated");
      expect(within(section).getByText("Top Rated")).toBeInTheDocument();
      expect(within(section).getByTestId("movie-grid")).toBeInTheDocument();
    });

    it("renders See All links for each section", async () => {
      renderHomePage();

      await waitFor(() => {
        const seeAllLinks = screen.getAllByText("See All");
        expect(seeAllLinks.length).toBeGreaterThanOrEqual(4);
      });
    });
  });

  describe("when clicking a movie card", () => {
    it("navigates to the movie detail page", async () => {
      const user = userEvent.setup();
      renderHomePage();

      await waitFor(() => {
        expect(screen.getByLabelText("Dune Part Two (2024)")).toBeInTheDocument();
      });

      const duneLink = screen.getByLabelText("Dune Part Two (2024)");
      await user.click(duneLink);

      await waitFor(() => {
        expect(screen.getByText("Movie Detail Page")).toBeInTheDocument();
      });
    });
  });

  describe("when clicking See All on Now Playing", () => {
    it("navigates to the now playing listing route", async () => {
      const user = userEvent.setup();
      renderHomePage();

      await waitFor(() => {
        const section = screen.getByTestId("section-now-playing");
        expect(within(section).getByText("Dune Part Two")).toBeInTheDocument();
      });

      const section = screen.getByTestId("section-now-playing");
      const seeAll = within(section).getByText("See All");
      await user.click(seeAll);

      await waitFor(() => {
        expect(screen.getByText("Now Playing Page")).toBeInTheDocument();
      });
    });
  });

  describe("when APIs are loading", () => {
    it("renders the hero banner skeleton", () => {
      // Override handlers with never-resolving responses
      server.use(
        http.get("/api/movies/popular", () => {
          return new Promise(() => {}); // never resolves
        }),
        http.get("/api/movies/configuration", () => {
          return new Promise(() => {}); // never resolves
        }),
      );

      renderHomePage();

      expect(screen.getByTestId("hero-banner-skeleton")).toBeInTheDocument();
    });

    it("renders skeleton cards in sections while loading", () => {
      server.use(
        http.get("/api/movies/now-playing", () => {
          return new Promise(() => {}); // never resolves
        }),
      );

      renderHomePage();

      const skeletons = screen.getAllByTestId("movie-card-skeleton");
      expect(skeletons.length).toBeGreaterThan(0);
    });
  });

  describe("when the Popular API returns an error", () => {
    it("shows an error state with a retry button in the Popular section", async () => {
      server.use(
        http.get("/api/movies/popular", () =>
          HttpResponse.json({ error: "Bad Gateway" }, { status: 502 }),
        ),
      );

      renderHomePage();

      await waitFor(() => {
        expect(screen.getByTestId("section-popular")).toBeInTheDocument();
      });

      const section = screen.getByTestId("section-popular");

      await waitFor(() => {
        expect(
          within(section).getByText(/failed to load popular movies/i),
        ).toBeInTheDocument();
      });

      expect(within(section).getByText("Try Again")).toBeInTheDocument();
    });

    it("still renders other sections that succeeded", async () => {
      server.use(
        http.get("/api/movies/popular", () =>
          HttpResponse.json({ error: "Bad Gateway" }, { status: 502 }),
        ),
      );

      renderHomePage();

      await waitFor(() => {
        const nowPlayingSection = screen.getByTestId("section-now-playing");
        expect(
          within(nowPlayingSection).getByText("Dune Part Two"),
        ).toBeInTheDocument();
      });
    });

    it("retries when the Try Again button is clicked", async () => {
      const user = userEvent.setup();
      let callCount = 0;

      server.use(
        http.get("/api/movies/popular", () => {
          callCount++;
          if (callCount <= 1) {
            return HttpResponse.json(
              { error: "Bad Gateway" },
              { status: 502 },
            );
          }
          return HttpResponse.json(makePaginatedResult(popularMovies));
        }),
      );

      renderHomePage();

      const section = await waitFor(() => {
        const s = screen.getByTestId("section-popular");
        expect(within(s).getByText("Try Again")).toBeInTheDocument();
        return s;
      });

      await user.click(within(section).getByText("Try Again"));

      await waitFor(() => {
        expect(within(section).getByText("Inception")).toBeInTheDocument();
      });
    });
  });
});
