import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { http, HttpResponse, delay } from "msw";
import { setupServer } from "msw/node";
import request from "supertest";
import { createTestApp } from "../../app.js";
import { MoviesService } from "./movies.service.js";
import { TmdbGateway } from "../../infrastructure/tmdb/tmdb.gateway.js";
import type { Express } from "express";

const TMDB_BASE_URL = "https://test-tmdb.example.com/3";

// --- TMDB response fixtures ---

function tmdbMovieListItem(overrides: Record<string, unknown> = {}) {
  return {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    vote_average: 8.4,
    release_date: "1999-10-15",
    genre_ids: [18, 53],
    overview: "An insomniac office worker...",
    backdrop_path: "/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg",
    ...overrides,
  };
}

function tmdbPaginatedResponse(
  overrides: Record<string, unknown> = {},
) {
  return {
    results: [tmdbMovieListItem()],
    page: 1,
    total_pages: 5,
    total_results: 100,
    ...overrides,
  };
}

const tmdbMovieDetail = {
  id: 550,
  title: "Fight Club",
  overview: "An insomniac office worker...",
  genres: [
    { id: 18, name: "Drama" },
    { id: 53, name: "Thriller" },
  ],
  runtime: 139,
  release_date: "1999-10-15",
  poster_path: "/poster.jpg",
  backdrop_path: "/backdrop.jpg",
  vote_average: 8.4,
};

const tmdbCredits = {
  cast: [
    {
      name: "Brad Pitt",
      character: "Tyler Durden",
      profile_path: "/profile.jpg",
    },
  ],
  crew: [
    { name: "David Fincher", job: "Director", department: "Directing" },
  ],
};

const tmdbVideos = {
  results: [
    {
      name: "Official Trailer",
      key: "SUXWAEX2jlg",
      site: "YouTube",
      type: "Trailer",
    },
    {
      name: "Vimeo Clip",
      key: "abc123",
      site: "Vimeo",
      type: "Clip",
    },
  ],
};

const tmdbConfiguration = {
  images: {
    secure_base_url: "https://image.tmdb.org/t/p/",
    poster_sizes: ["w92", "w185", "w500", "original"],
    backdrop_sizes: ["w300", "w780", "original"],
  },
};

// --- MSW server setup ---

const handlers = [
  http.get(`${TMDB_BASE_URL}/movie/now_playing`, () =>
    HttpResponse.json(tmdbPaginatedResponse()),
  ),
  http.get(`${TMDB_BASE_URL}/movie/upcoming`, () =>
    HttpResponse.json(tmdbPaginatedResponse()),
  ),
  http.get(`${TMDB_BASE_URL}/movie/popular`, ({ request: req }) => {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);

    if (page === 9999) {
      return HttpResponse.json(
        tmdbPaginatedResponse({
          results: [],
          page: 9999,
          total_pages: 5,
          total_results: 100,
        }),
      );
    }

    if (page === 2) {
      return HttpResponse.json(
        tmdbPaginatedResponse({ page: 2 }),
      );
    }

    return HttpResponse.json(tmdbPaginatedResponse());
  }),
  http.get(`${TMDB_BASE_URL}/movie/top_rated`, () =>
    HttpResponse.json(tmdbPaginatedResponse()),
  ),
  http.get(`${TMDB_BASE_URL}/movie/999999999`, () =>
    HttpResponse.json(
      { status_code: 34, status_message: "The resource you requested could not be found." },
      { status: 404 },
    ),
  ),
  http.get(`${TMDB_BASE_URL}/movie/550`, () =>
    HttpResponse.json(tmdbMovieDetail),
  ),
  http.get(`${TMDB_BASE_URL}/movie/550/credits`, () =>
    HttpResponse.json(tmdbCredits),
  ),
  http.get(`${TMDB_BASE_URL}/movie/550/videos`, () =>
    HttpResponse.json(tmdbVideos),
  ),
  http.get(`${TMDB_BASE_URL}/movie/550/similar`, () =>
    HttpResponse.json(tmdbPaginatedResponse()),
  ),
  http.get(`${TMDB_BASE_URL}/search/movie`, ({ request: req }) => {
    const url = new URL(req.url);
    const query = url.searchParams.get("query") ?? "";
    const page = parseInt(url.searchParams.get("page") ?? "1", 10);

    if (!query) {
      return HttpResponse.json(tmdbPaginatedResponse({ results: [] }));
    }

    return HttpResponse.json(
      tmdbPaginatedResponse({ page }),
    );
  }),
  http.get(`${TMDB_BASE_URL}/configuration`, () =>
    HttpResponse.json(tmdbConfiguration),
  ),
];

const server = setupServer(...handlers);

// --- Test setup ---

let app: Express;

beforeAll(() => {
  server.listen({ onUnhandledRequest: "bypass" });

  const gateway = new TmdbGateway({
    baseUrl: TMDB_BASE_URL,
    readAccessToken: "test-token",
  });
  const service = MoviesService.create(gateway);
  app = createTestApp({ moviesService: service });
});

afterEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

// --- Tests ---

describe("Movies Router", () => {
  describe("GET /api/movies/now-playing", () => {
    describe("when requesting now playing movies", () => {
      it("returns a paginated list of movies", async () => {
        const res = await request(app).get("/api/movies/now-playing");

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(1);
        expect(res.body.page).toBe(1);
        expect(res.body.totalPages).toBe(5);
        expect(res.body.totalResults).toBe(100);
      });

      it("returns movies with normalized domain fields", async () => {
        const res = await request(app).get("/api/movies/now-playing");
        const movie = res.body.results[0];

        expect(movie.tmdbId).toBe(550);
        expect(movie.title).toBe("Fight Club");
        expect(movie.year).toBe(1999);
        expect(movie.posterPath).toBe("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg");
        expect(movie.rating).toBe(8.4);
      });
    });
  });

  describe("GET /api/movies/upcoming", () => {
    describe("when requesting upcoming movies", () => {
      it("returns a paginated list with releaseDate", async () => {
        const res = await request(app).get("/api/movies/upcoming");

        expect(res.status).toBe(200);
        expect(res.body.results[0].releaseDate).toBe("1999-10-15");
      });
    });
  });

  describe("GET /api/movies/popular", () => {
    describe("when requesting popular movies", () => {
      it("returns a paginated list", async () => {
        const res = await request(app).get("/api/movies/popular");

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(1);
      });
    });

    describe("when requesting page 2", () => {
      it("returns the second page", async () => {
        const res = await request(app).get("/api/movies/popular?page=2");

        expect(res.status).toBe(200);
        expect(res.body.page).toBe(2);
      });
    });

    describe("when requesting out-of-range page", () => {
      it("returns an empty results list with pagination info", async () => {
        const res = await request(app).get("/api/movies/popular?page=9999");

        expect(res.status).toBe(200);
        expect(res.body.results).toEqual([]);
        expect(res.body.page).toBe(9999);
        expect(res.body.totalPages).toBeDefined();
      });
    });
  });

  describe("GET /api/movies/top-rated", () => {
    describe("when requesting top rated movies", () => {
      it("returns a paginated list", async () => {
        const res = await request(app).get("/api/movies/top-rated");

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(1);
      });
    });
  });

  describe("GET /api/movies/:id", () => {
    describe("when requesting details for an existing movie", () => {
      it("returns full movie details with normalized fields", async () => {
        const res = await request(app).get("/api/movies/550");

        expect(res.status).toBe(200);
        expect(res.body.tmdbId).toBe(550);
        expect(res.body.title).toBe("Fight Club");
        expect(res.body.year).toBe(1999);
        expect(res.body.synopsis).toBe("An insomniac office worker...");
        expect(res.body.genres).toEqual(["Drama", "Thriller"]);
        expect(res.body.runtime).toBe(139);
        expect(res.body.releaseDate).toBe("1999-10-15");
        expect(res.body.posterPath).toBe("/poster.jpg");
        expect(res.body.backdropPath).toBe("/backdrop.jpg");
        expect(res.body.tmdbRating).toBe(8.4);
      });
    });

    describe("when requesting a non-existent movie", () => {
      it("returns 404", async () => {
        const res = await request(app).get("/api/movies/999999999");

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found/i);
      });
    });
  });

  describe("GET /api/movies/:id/credits", () => {
    describe("when requesting credits for an existing movie", () => {
      it("returns cast and director", async () => {
        const res = await request(app).get("/api/movies/550/credits");

        expect(res.status).toBe(200);
        expect(res.body.cast).toEqual([
          {
            name: "Brad Pitt",
            character: "Tyler Durden",
            profilePath: "/profile.jpg",
          },
        ]);
        expect(res.body.director).toBe("David Fincher");
      });
    });
  });

  describe("GET /api/movies/:id/videos", () => {
    describe("when requesting videos for an existing movie", () => {
      it("returns YouTube videos only with normalized fields", async () => {
        const res = await request(app).get("/api/movies/550/videos");

        expect(res.status).toBe(200);
        expect(res.body).toHaveLength(1);
        expect(res.body[0].name).toBe("Official Trailer");
        expect(res.body[0].youtubeKey).toBe("SUXWAEX2jlg");
        expect(res.body[0].type).toBe("Trailer");
      });
    });
  });

  describe("GET /api/movies/:id/similar", () => {
    describe("when requesting similar movies", () => {
      it("returns a paginated list of related movies", async () => {
        const res = await request(app).get("/api/movies/550/similar");

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(1);
        expect(res.body.results[0].tmdbId).toBe(550);
      });
    });
  });

  describe("GET /api/movies/search", () => {
    describe("when searching with a valid query", () => {
      it("returns a paginated list of matching movies", async () => {
        const res = await request(app).get(
          "/api/movies/search?q=inception",
        );

        expect(res.status).toBe(200);
        expect(res.body.results).toHaveLength(1);
        expect(res.body.page).toBe(1);
      });
    });

    describe("when searching with pagination", () => {
      it("returns the specified page", async () => {
        const res = await request(app).get(
          "/api/movies/search?q=the&page=2",
        );

        expect(res.status).toBe(200);
        expect(res.body.page).toBe(2);
      });
    });

    describe("when searching with an empty query", () => {
      it("returns 400 validation error", async () => {
        const res = await request(app).get("/api/movies/search?q=");

        expect(res.status).toBe(400);
        expect(res.body.error).toBe("Validation error");
      });
    });
  });

  describe("GET /api/movies/configuration", () => {
    describe("when requesting image configuration", () => {
      it("returns base URL and available sizes", async () => {
        const res = await request(app).get("/api/movies/configuration");

        expect(res.status).toBe(200);
        expect(res.body.baseUrl).toBe("https://image.tmdb.org/t/p/");
        expect(res.body.posterSizes).toEqual([
          "w92",
          "w185",
          "w500",
          "original",
        ]);
        expect(res.body.backdropSizes).toEqual([
          "w300",
          "w780",
          "original",
        ]);
      });
    });
  });

  describe("error handling", () => {
    describe("when TMDB API is unreachable", () => {
      it("returns 502 bad gateway", async () => {
        server.use(
          http.get(`${TMDB_BASE_URL}/movie/popular`, () =>
            HttpResponse.error(),
          ),
        );

        const res = await request(app).get("/api/movies/popular");

        expect(res.status).toBe(502);
        expect(res.body.error).toMatch(/unavailable/i);
      });
    });

    describe("when TMDB API times out", () => {
      it("returns 504 gateway timeout", async () => {
        server.use(
          http.get(`${TMDB_BASE_URL}/movie/popular`, async () => {
            // msw delay longer than our 5s timeout
            await delay(10_000);
            return HttpResponse.json(tmdbPaginatedResponse());
          }),
        );

        const res = await request(app).get("/api/movies/popular");

        expect(res.status).toBe(504);
        expect(res.body.error).toMatch(/timed out/i);
      });
    });

    describe("when TMDB API returns malformed JSON", () => {
      it("returns 502 bad gateway", async () => {
        server.use(
          http.get(`${TMDB_BASE_URL}/movie/popular`, () =>
            new HttpResponse("not json {{{", {
              status: 200,
              headers: { "Content-Type": "application/json" },
            }),
          ),
        );

        const res = await request(app).get("/api/movies/popular");

        expect(res.status).toBe(502);
        expect(res.body.error).toMatch(/malformed/i);
      });
    });
  });
});
