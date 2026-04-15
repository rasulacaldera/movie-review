import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  usePopularMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
  useMovieDetail,
  useMovieCredits,
  useMovieVideos,
  useSimilarMovies,
  useImageConfig,
  isValidYoutubeKey,
} from "~/domains/movies/hooks.js";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

const mockPaginatedData = {
  results: [{ tmdbId: 1, title: "Test" }],
  page: 1,
  totalPages: 1,
  totalResults: 1,
};

describe("usePopularMovies()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("when the API succeeds", () => {
    it("returns isLoading true initially", () => {
      globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {})); // never resolves

      const { result } = renderHook(() => usePopularMovies(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("returns data when the request succeeds", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedData),
      });

      const { result } = renderHook(() => usePopularMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaginatedData);
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const { result } = renderHook(() => usePopularMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useNowPlayingMovies()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("when the API succeeds", () => {
    it("returns isLoading true initially", () => {
      globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useNowPlayingMovies(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("returns data when the request succeeds", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedData),
      });

      const { result } = renderHook(() => useNowPlayingMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaginatedData);
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const { result } = renderHook(() => useNowPlayingMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useUpcomingMovies()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("when the API succeeds", () => {
    it("returns isLoading true initially", () => {
      globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useUpcomingMovies(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("returns data when the request succeeds", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedData),
      });

      const { result } = renderHook(() => useUpcomingMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaginatedData);
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const { result } = renderHook(() => useUpcomingMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useTopRatedMovies()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("when the API succeeds", () => {
    it("returns isLoading true initially", () => {
      globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useTopRatedMovies(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("returns data when the request succeeds", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedData),
      });

      const { result } = renderHook(() => useTopRatedMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaginatedData);
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const { result } = renderHook(() => useTopRatedMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useMovieDetail()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const mockDetail = { tmdbId: 550, title: "Fight Club", runtime: 139 };

  describe("when the API succeeds", () => {
    it("returns isLoading true initially", () => {
      globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useMovieDetail(550), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("returns the MovieDetail data when the request succeeds", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockDetail),
      });

      const { result } = renderHook(() => useMovieDetail(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockDetail);
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        statusText: "Not Found",
      });

      const { result } = renderHook(() => useMovieDetail(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useMovieCredits()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const mockCredits = {
    cast: [
      {
        id: 4,
        name: "Brad Pitt",
        character: "Tyler Durden",
        profilePath: "/brad.jpg",
      },
    ],
    director: "David Fincher",
  };

  describe("when the API succeeds", () => {
    it("returns the cast array and director when successful", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockCredits),
      });

      const { result } = renderHook(() => useMovieCredits(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data?.cast).toHaveLength(1);
      expect(result.current.data?.director).toBe("David Fincher");
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
      });

      const { result } = renderHook(() => useMovieCredits(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useMovieVideos()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("when the API succeeds", () => {
    it("returns only videos with type Trailer or Teaser", async () => {
      const allVideos = [
        {
          name: "Official Trailer",
          youtubeKey: "abcDEF12345",
          type: "Trailer",
        },
        { name: "Teaser", youtubeKey: "defGHI67890", type: "Teaser" },
        {
          name: "Behind the Scenes",
          youtubeKey: "ghiJKL11111",
          type: "Behind the Scenes",
        },
        { name: "Featurette", youtubeKey: "jklMNO22222", type: "Featurette" },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(allVideos),
      });

      const { result } = renderHook(() => useMovieVideos(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].type).toBe("Trailer");
      expect(result.current.data?.[1].type).toBe("Teaser");
    });

    it("filters out trailers with invalid YouTube keys", async () => {
      const videos = [
        { name: "Valid Trailer", youtubeKey: "qtRKdVHc-cE", type: "Trailer" },
        {
          name: "XSS Attempt",
          youtubeKey: 'abc"><script>alert(1)</script>',
          type: "Trailer",
        },
        { name: "Too Short", youtubeKey: "abc", type: "Trailer" },
        { name: "Valid Teaser", youtubeKey: "abcDEF12345", type: "Teaser" },
      ];

      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(videos),
      });

      const { result } = renderHook(() => useMovieVideos(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(2);
      expect(result.current.data?.[0].name).toBe("Valid Trailer");
      expect(result.current.data?.[1].name).toBe("Valid Teaser");
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const { result } = renderHook(() => useMovieVideos(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useSimilarMovies()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  describe("when the API succeeds", () => {
    it("returns a paginated list of similar MovieSummary items", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockPaginatedData),
      });

      const { result } = renderHook(() => useSimilarMovies(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockPaginatedData);
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const { result } = renderHook(() => useSimilarMovies(550), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });
});

describe("useImageConfig()", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  const mockImageConfig = {
    baseUrl: "https://image.tmdb.org/t/p/",
    posterSizes: ["w185", "w342", "w500"],
    backdropSizes: ["w300", "w780", "w1280"],
  };

  describe("when the API succeeds", () => {
    it("returns isLoading true initially", () => {
      globalThis.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

      const { result } = renderHook(() => useImageConfig(), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);
      expect(result.current.data).toBeUndefined();
    });

    it("returns image configuration data when the request succeeds", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockImageConfig),
      });

      const { result } = renderHook(() => useImageConfig(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockImageConfig);
    });
  });

  describe("when the API fails", () => {
    it("returns error when the request fails", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const { result } = renderHook(() => useImageConfig(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toBeDefined();
    });
  });

  describe("when checking staleTime configuration", () => {
    it("does not refetch within the 24-hour stale window", async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockImageConfig),
      });

      const wrapper = createWrapper();

      const { result, rerender } = renderHook(() => useImageConfig(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // Re-render the hook — should not trigger another fetch due to staleTime
      rerender();

      expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    });
  });
});

describe("isValidYoutubeKey()", () => {
  describe("when given a valid 11-character YouTube key", () => {
    it("returns true for a standard key", () => {
      expect(isValidYoutubeKey("qtRKdVHc-cE")).toBe(true);
    });

    it("returns true for a key with underscores and dashes", () => {
      expect(isValidYoutubeKey("abc_DEF-123")).toBe(true);
    });
  });

  describe("when given an invalid YouTube key", () => {
    it("returns false for an empty string", () => {
      expect(isValidYoutubeKey("")).toBe(false);
    });

    it("returns false for a key that is too short", () => {
      expect(isValidYoutubeKey("abc123")).toBe(false);
    });

    it("returns false for a key that is too long", () => {
      expect(isValidYoutubeKey("abcDEF123456")).toBe(false);
    });

    it("returns false for a key with special characters", () => {
      expect(isValidYoutubeKey('abc"><script')).toBe(false);
    });

    it("returns false for a key with spaces", () => {
      expect(isValidYoutubeKey("abc DEF 123")).toBe(false);
    });
  });
});
