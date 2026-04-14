import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import {
  usePopularMovies,
  useNowPlayingMovies,
  useUpcomingMovies,
  useTopRatedMovies,
  useImageConfig,
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
