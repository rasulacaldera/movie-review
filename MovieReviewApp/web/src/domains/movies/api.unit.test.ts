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

      const result = await fetchPopularMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/popular?page=1",
      );
      expect(result).toEqual(mockPaginatedResponse);
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
    it("calls /api/movies/now-playing with default page and returns parsed response", async () => {
      stubFetch(mockPaginatedResponse);

      const result = await fetchNowPlayingMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/now-playing?page=1",
      );
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe("fetchUpcomingMovies()", () => {
    it("calls /api/movies/upcoming with default page and returns parsed response", async () => {
      stubFetch(mockPaginatedResponse);

      const result = await fetchUpcomingMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/upcoming?page=1",
      );
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe("fetchTopRatedMovies()", () => {
    it("calls /api/movies/top-rated with default page and returns parsed response", async () => {
      stubFetch(mockPaginatedResponse);

      const result = await fetchTopRatedMovies();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/top-rated?page=1",
      );
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe("fetchMovieDetails()", () => {
    it("calls /api/movies/:id and returns parsed response", async () => {
      const mockDetail = { tmdbId: 550, title: "Fight Club" };
      stubFetch(mockDetail);

      const result = await fetchMovieDetails(550);

      expect(globalThis.fetch).toHaveBeenCalledWith("/api/movies/550");
      expect(result).toEqual(mockDetail);
    });
  });

  describe("fetchImageConfig()", () => {
    it("calls /api/movies/configuration and returns parsed response", async () => {
      const mockConfig = {
        baseUrl: "https://image.tmdb.org/t/p/",
        posterSizes: ["w500"],
        backdropSizes: ["w1280"],
      };
      stubFetch(mockConfig);

      const result = await fetchImageConfig();

      expect(globalThis.fetch).toHaveBeenCalledWith(
        "/api/movies/configuration",
      );
      expect(result).toEqual(mockConfig);
    });
  });
});
