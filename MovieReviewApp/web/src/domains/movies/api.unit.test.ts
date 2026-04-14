import {
  fetchPopularMovies,
  fetchNowPlayingMovies,
  fetchUpcomingMovies,
  fetchTopRatedMovies,
  fetchMovieDetails,
  fetchImageConfig,
} from "~/domains/movies/api.js";

describe("movies API functions", () => {
  const originalFetch = globalThis.fetch;

  const mockPaginatedResponse = {
    results: [{ tmdbId: 1, title: "Test Movie" }],
    page: 1,
    totalPages: 5,
    totalResults: 100,
  };

  function stubFetch(data: unknown) {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });
  }

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("fetchPopularMovies()", () => {
    it("calls /api/movies/popular with default page", async () => {
      stubFetch(mockPaginatedResponse);

      await fetchPopularMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/popular?page=1",
      );
    });

    it("calls /api/movies/popular with specified page", async () => {
      stubFetch(mockPaginatedResponse);

      await fetchPopularMovies(3);

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/popular?page=3",
      );
    });
  });

  describe("fetchNowPlayingMovies()", () => {
    it("calls /api/movies/now-playing with default page", async () => {
      stubFetch(mockPaginatedResponse);

      await fetchNowPlayingMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/now-playing?page=1",
      );
    });
  });

  describe("fetchUpcomingMovies()", () => {
    it("calls /api/movies/upcoming with default page", async () => {
      stubFetch(mockPaginatedResponse);

      await fetchUpcomingMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/upcoming?page=1",
      );
    });
  });

  describe("fetchTopRatedMovies()", () => {
    it("calls /api/movies/top-rated with default page", async () => {
      stubFetch(mockPaginatedResponse);

      await fetchTopRatedMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/top-rated?page=1",
      );
    });
  });

  describe("fetchMovieDetails()", () => {
    it("calls /api/movies/:id", async () => {
      stubFetch({ tmdbId: 550, title: "Fight Club" });

      await fetchMovieDetails(550);

      expect(globalThis.fetch).toHaveBeenCalledWith("/api/movies/550");
    });
  });

  describe("fetchImageConfig()", () => {
    it("calls /api/movies/configuration", async () => {
      stubFetch({
        baseUrl: "https://image.tmdb.org/t/p/",
        posterSizes: ["w500"],
        backdropSizes: ["w1280"],
      });

      await fetchImageConfig();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/configuration",
      );
    });
  });
});
