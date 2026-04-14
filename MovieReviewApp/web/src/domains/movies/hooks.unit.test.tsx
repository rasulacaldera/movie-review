import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { usePopularMovies } from "~/domains/movies/hooks.js";

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
      const mockData = {
        results: [{ tmdbId: 1, title: "Test" }],
        page: 1,
        totalPages: 1,
        totalResults: 1,
      };
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockData),
      });

      const { result } = renderHook(() => usePopularMovies(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockData);
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
