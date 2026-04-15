import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import MovieDetailPage from "~/pages/MovieDetailPage/index.js";
import type {
  MovieDetail,
  MovieCredits,
  MovieVideo,
  MovieSummary,
  PaginatedResult,
  ImageConfiguration,
} from "~/domains/movies/types.js";

// --- Test data ---

function makeMovieDetail(overrides: Partial<MovieDetail> = {}): MovieDetail {
  return {
    tmdbId: 550,
    title: "Fight Club",
    year: 1999,
    synopsis:
      "An insomniac office worker and a devil-may-care soap maker form an underground fight club.",
    genres: ["Drama", "Thriller"],
    runtime: 139,
    releaseDate: "1999-10-15",
    posterPath: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    backdropPath: "/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg",
    tmdbRating: 8.4,
    ...overrides,
  };
}

function makeCredits(overrides: Partial<MovieCredits> = {}): MovieCredits {
  return {
    cast: [
      {
        id: 4,
        name: "Brad Pitt",
        character: "Tyler Durden",
        profilePath: "/brad.jpg",
      },
      {
        id: 5,
        name: "Edward Norton",
        character: "The Narrator",
        profilePath: "/edward.jpg",
      },
      {
        id: 6,
        name: "Helena Bonham Carter",
        character: "Marla Singer",
        profilePath: null,
      },
    ],
    director: "David Fincher",
    ...overrides,
  };
}

function makeVideos(): MovieVideo[] {
  return [
    { name: "Official Trailer", youtubeKey: "qtRKdVHc-cE", type: "Trailer" },
    { name: "Official Teaser", youtubeKey: "abcDEF12345", type: "Teaser" },
    {
      name: "Behind the Scenes",
      youtubeKey: "xyz789ABCDE",
      type: "Behind the Scenes",
    },
  ];
}

function makeSimilarMovies(): PaginatedResult<MovieSummary> {
  return {
    results: [
      {
        tmdbId: 680,
        title: "Pulp Fiction",
        year: 1994,
        posterPath: "/pulp.jpg",
        backdropPath: "/pulp_bd.jpg",
        tmdbRating: 8.5,
        releaseDate: "1994-10-14",
        genres: ["Crime", "Thriller"],
      },
      {
        tmdbId: 807,
        title: "Se7en",
        year: 1995,
        posterPath: "/seven.jpg",
        backdropPath: "/seven_bd.jpg",
        tmdbRating: 8.3,
        releaseDate: "1995-09-22",
        genres: ["Crime", "Thriller"],
      },
    ],
    page: 1,
    totalPages: 1,
    totalResults: 2,
  };
}

const imageConfig: ImageConfiguration = {
  baseUrl: "https://image.tmdb.org/t/p/",
  posterSizes: ["w185", "w342", "w500"],
  backdropSizes: ["w300", "w780", "w1280"],
};

// --- MSW server ---

const defaultHandlers = [
  http.get("/api/movies/configuration", () => HttpResponse.json(imageConfig)),
  http.get("/api/movies/:id/credits", () => HttpResponse.json(makeCredits())),
  http.get("/api/movies/:id/videos", () => HttpResponse.json(makeVideos())),
  http.get("/api/movies/:id/similar", () =>
    HttpResponse.json(makeSimilarMovies()),
  ),
  http.get("/api/movies/:id", () => HttpResponse.json(makeMovieDetail())),
];

const server = setupServer(...defaultHandlers);

beforeAll(() => {
  window.scrollTo = vi.fn() as unknown as typeof window.scrollTo;
  server.listen({ onUnhandledRequest: "error" });
});
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// --- Render helper ---

function renderMovieDetailPage(movieId = "550") {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const router = createMemoryRouter(
    [
      {
        path: "/movie/:id",
        element: <MovieDetailPage />,
      },
      {
        path: "/",
        element: <div>Home Page</div>,
      },
    ],
    { initialEntries: [`/movie/${movieId}`] },
  );

  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

// --- Tests ---

describe("<MovieDetailPage/>", () => {
  // --- Scroll to top ---
  describe("when the page renders", () => {
    it("scrolls to the top of the page", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
      });
    });
  });

  // --- Hero Section ---
  describe("when the movie detail API returns data", () => {
    it("displays the movie title", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });
    });

    it("displays the release year", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("1999")).toBeInTheDocument();
      });
    });

    it("displays the genre tags", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Drama")).toBeInTheDocument();
        expect(screen.getByText("Thriller")).toBeInTheDocument();
      });
    });

    it("displays the runtime formatted as hours and minutes", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("2h 19m")).toBeInTheDocument();
      });
    });

    it("displays the release date", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("1999-10-15")).toBeInTheDocument();
      });
    });

    it("displays the TMDB rating prominently", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        const ratings = screen.getAllByText("8.4");
        expect(ratings.length).toBeGreaterThanOrEqual(1);
      });
    });

    it("displays a star rating visual", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(
          screen.getByRole("img", { name: /Rating: 8.4 out of 10/ }),
        ).toBeInTheDocument();
      });
    });

    it("displays the backdrop image", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByTestId("hero-backdrop")).toBeInTheDocument();
      });
    });

    it("displays the poster image", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByAltText("Fight Club poster")).toBeInTheDocument();
      });
    });
  });

  describe("when the movie has zero runtime", () => {
    it("does not display the runtime", async () => {
      server.use(
        http.get("/api/movies/:id", () =>
          HttpResponse.json(makeMovieDetail({ runtime: 0 })),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });

      expect(screen.queryByText(/\dh \d+m/)).not.toBeInTheDocument();
    });
  });

  describe("when the movie has a null backdropPath", () => {
    it("renders the hero section with a fallback background", async () => {
      server.use(
        http.get("/api/movies/:id", () =>
          HttpResponse.json(makeMovieDetail({ backdropPath: null })),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });

      expect(screen.getByTestId("hero-section")).toBeInTheDocument();
      expect(screen.queryByTestId("hero-backdrop")).not.toBeInTheDocument();
    });
  });

  describe("when the movie has a null posterPath", () => {
    it("displays a placeholder image", async () => {
      server.use(
        http.get("/api/movies/:id", () =>
          HttpResponse.json(makeMovieDetail({ posterPath: null })),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByTestId("poster-placeholder")).toBeInTheDocument();
      });
    });
  });

  // --- Synopsis ---
  describe("when the movie has a synopsis", () => {
    it("displays the Synopsis heading and overview text", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Synopsis")).toBeInTheDocument();
        expect(
          screen.getByText(/An insomniac office worker/),
        ).toBeInTheDocument();
      });
    });
  });

  describe("when the movie has an empty synopsis", () => {
    it("does not render the Synopsis section", async () => {
      server.use(
        http.get("/api/movies/:id", () =>
          HttpResponse.json(makeMovieDetail({ synopsis: "" })),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });

      expect(screen.queryByText("Synopsis")).not.toBeInTheDocument();
    });
  });

  // --- Cast & Crew ---
  describe("when credits API returns cast and director", () => {
    it("displays the Cast heading", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Cast")).toBeInTheDocument();
      });
    });

    it("displays cast members with name and character", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Brad Pitt")).toBeInTheDocument();
        expect(screen.getByText("Tyler Durden")).toBeInTheDocument();
      });
    });

    it("displays cast member profile images with descriptive alt text", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByAltText("Photo of Brad Pitt")).toBeInTheDocument();
      });
    });

    it("displays the director prominently", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(
          screen.getByText(/Directed by David Fincher/),
        ).toBeInTheDocument();
      });
    });

    it("shows a person placeholder for cast members with null profilePath", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Helena Bonham Carter")).toBeInTheDocument();
      });

      const card = screen
        .getByText("Helena Bonham Carter")
        .closest("[data-testid='cast-card']");
      expect(card).toBeInTheDocument();
      expect(
        within(card!).getByTestId("profile-placeholder"),
      ).toBeInTheDocument();
    });
  });

  describe("when credits API returns empty cast", () => {
    it("shows a message indicating no cast information is available", async () => {
      server.use(
        http.get("/api/movies/:id/credits", () =>
          HttpResponse.json({ cast: [], director: null }),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/no cast information/i)).toBeInTheDocument();
      });
    });
  });

  // --- Trailers ---
  describe("when videos API returns trailers", () => {
    it("displays the Trailers heading", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Trailers")).toBeInTheDocument();
      });
    });

    it("displays trailer cards with thumbnails and play buttons", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Official Trailer")).toBeInTheDocument();
        expect(screen.getByText("Official Teaser")).toBeInTheDocument();
      });
    });

    it("only shows trailers and teasers, not behind the scenes", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Official Trailer")).toBeInTheDocument();
      });

      expect(screen.queryByText("Behind the Scenes")).not.toBeInTheDocument();
    });

    it("loads YouTube embed on play click", async () => {
      const user = userEvent.setup();
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Official Trailer")).toBeInTheDocument();
      });

      const playButton = screen.getAllByLabelText(/Play/)[0];
      await user.click(playButton);

      await waitFor(() => {
        const iframe = screen.getByTitle("Official Trailer");
        expect(iframe).toBeInTheDocument();
        expect(iframe).toHaveAttribute(
          "src",
          expect.stringContaining("youtube-nocookie.com"),
        );
      });
    });

    it("allows selecting between multiple trailers", async () => {
      const user = userEvent.setup();
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Official Trailer")).toBeInTheDocument();
      });

      // Click the second trailer to select it
      const teaserTab = screen.getByRole("tab", { name: /Official Teaser/ });
      await user.click(teaserTab);

      // The selected trailer should be highlighted / active
      expect(teaserTab).toHaveAttribute("aria-selected", "true");
    });
  });

  describe("when videos API returns only Behind the Scenes videos", () => {
    it("does not render the Trailers section", async () => {
      server.use(
        http.get("/api/movies/:id/videos", () =>
          HttpResponse.json([
            {
              name: "BTS",
              youtubeKey: "xyz789ABCDE",
              type: "Behind the Scenes",
            },
          ]),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });

      expect(screen.queryByText("Trailers")).not.toBeInTheDocument();
    });
  });

  // --- Similar Movies ---
  describe("when similar movies API returns results", () => {
    it("displays the Similar Movies heading", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Similar Movies")).toBeInTheDocument();
      });
    });

    it("displays movie cards for similar movies", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Pulp Fiction")).toBeInTheDocument();
        expect(screen.getByText("Se7en")).toBeInTheDocument();
      });
    });

    it("links similar movie cards to their detail pages", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Pulp Fiction")).toBeInTheDocument();
      });

      const link = screen.getByLabelText("Pulp Fiction (1994)");
      expect(link).toHaveAttribute("href", "/movie/680");
    });
  });

  describe("when similar movies API returns empty list", () => {
    it("does not render the Similar Movies section", async () => {
      server.use(
        http.get("/api/movies/:id/similar", () =>
          HttpResponse.json({
            results: [],
            page: 1,
            totalPages: 0,
            totalResults: 0,
          }),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });

      expect(screen.queryByText("Similar Movies")).not.toBeInTheDocument();
    });
  });

  // --- Reviews Placeholder ---
  describe("when viewing the reviews section", () => {
    it("shows a Reviews heading and coming soon message", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Reviews")).toBeInTheDocument();
        expect(screen.getByText(/coming soon/i)).toBeInTheDocument();
      });
    });
  });

  // --- Action Buttons ---
  describe("when viewing action buttons", () => {
    it("displays Add to Watchlist and Write Review buttons", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Add to Watchlist")).toBeInTheDocument();
        expect(screen.getByText("Write Review")).toBeInTheDocument();
      });
    });

    it("buttons indicate auth is required", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        const watchlistBtn = screen
          .getByText("Add to Watchlist")
          .closest("button");
        expect(watchlistBtn).toBeDisabled();
      });
    });
  });

  // --- Loading State ---
  describe("when the API is slow to respond", () => {
    it("shows skeleton placeholders while loading", () => {
      server.use(
        http.get("/api/movies/:id", () => new Promise(() => {})),
        http.get("/api/movies/:id/credits", () => new Promise(() => {})),
        http.get("/api/movies/:id/videos", () => new Promise(() => {})),
        http.get("/api/movies/:id/similar", () => new Promise(() => {})),
      );

      renderMovieDetailPage();

      expect(screen.getByTestId("hero-skeleton")).toBeInTheDocument();
      expect(screen.getByTestId("cast-skeleton")).toBeInTheDocument();
      expect(screen.getByTestId("synopsis-skeleton")).toBeInTheDocument();
    });
  });

  describe("when movie detail responds quickly but credits is slow", () => {
    it("renders hero and synopsis while cast still shows skeleton", async () => {
      server.use(
        http.get("/api/movies/:id/credits", () => new Promise(() => {})),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });

      expect(screen.getByText("Synopsis")).toBeInTheDocument();
      expect(screen.getByTestId("cast-skeleton")).toBeInTheDocument();
    });
  });

  // --- Error Handling ---
  describe("when movie detail API returns 502", () => {
    it("shows an error state with retry button", async () => {
      server.use(
        http.get("/api/movies/:id", () =>
          HttpResponse.json({ error: "Bad Gateway" }, { status: 502 }),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Try Again")).toBeInTheDocument();
      });
    });

    it("retries on clicking Try Again", async () => {
      const user = userEvent.setup();
      let callCount = 0;

      server.use(
        http.get("/api/movies/:id", () => {
          callCount++;
          if (callCount <= 1) {
            return HttpResponse.json({ error: "Bad Gateway" }, { status: 502 });
          }
          return HttpResponse.json(makeMovieDetail());
        }),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Try Again")).toBeInTheDocument();
      });

      await user.click(screen.getByText("Try Again"));

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });
    });
  });

  describe("when movie detail API returns 404", () => {
    it("shows a Movie not found message with link to home", async () => {
      server.use(
        http.get("/api/movies/:id", () =>
          HttpResponse.json({ error: "Not Found" }, { status: 404 }),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText(/Movie not found/i)).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
      });
    });
  });

  describe("when the route parameter is non-numeric", () => {
    it("shows Movie not found without making an API call", async () => {
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      renderMovieDetailPage("abc");

      await waitFor(() => {
        expect(screen.getByText(/Movie not found/i)).toBeInTheDocument();
      });

      // Should not have made a call for movie detail
      const movieCalls = fetchSpy.mock.calls.filter(
        (call) =>
          typeof call[0] === "string" && call[0].includes("/api/movies/abc"),
      );
      expect(movieCalls).toHaveLength(0);

      fetchSpy.mockRestore();
    });
  });

  describe("when credits API fails but detail succeeds", () => {
    it("renders hero normally and shows error in cast section", async () => {
      server.use(
        http.get("/api/movies/:id/credits", () =>
          HttpResponse.json({ error: "Bad Gateway" }, { status: 502 }),
        ),
      );

      renderMovieDetailPage();

      await waitFor(() => {
        expect(screen.getByText("Fight Club")).toBeInTheDocument();
      });

      await waitFor(() => {
        const castSection = screen.getByTestId("cast-section");
        expect(within(castSection).getByText("Try Again")).toBeInTheDocument();
      });
    });
  });

  // --- SEO ---
  describe("when the page loads successfully", () => {
    it("sets the document title to include the movie name", async () => {
      renderMovieDetailPage();

      await waitFor(() => {
        expect(document.title).toContain("Fight Club");
      });
    });
  });
});
