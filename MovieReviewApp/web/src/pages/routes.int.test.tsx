import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { routeConfig } from "~/router.js";

// Minimal msw handlers so pages that use React Query don't crash
const emptyPaginated = { results: [], page: 1, totalPages: 0, totalResults: 0 };
const imageConfig = {
  baseUrl: "https://image.tmdb.org/t/p/",
  posterSizes: ["w500"],
  backdropSizes: ["w1280"],
};

const server = setupServer(
  http.get("/api/movies/popular", () => HttpResponse.json(emptyPaginated)),
  http.get("/api/movies/now-playing", () => HttpResponse.json(emptyPaginated)),
  http.get("/api/movies/upcoming", () => HttpResponse.json(emptyPaginated)),
  http.get("/api/movies/top-rated", () => HttpResponse.json(emptyPaginated)),
  http.get("/api/movies/configuration", () => HttpResponse.json(imageConfig)),
);

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderRoute(path: string) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  const router = createMemoryRouter(routeConfig, { initialEntries: [path] });
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
}

describe("Route stubs", () => {
  describe("when navigating to /", () => {
    it("renders the home page", async () => {
      renderRoute("/");

      await waitFor(() => {
        expect(
          screen.getByLabelText("Loading featured movie"),
        ).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /coming-soon", () => {
    it("renders the coming soon page", async () => {
      renderRoute("/coming-soon");

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Coming Soon" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /top-rated", () => {
    it("renders the top rated page", async () => {
      renderRoute("/top-rated");

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Top Rated" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /popular", () => {
    it("renders the popular page", async () => {
      renderRoute("/popular");

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Popular" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /movie/:id", () => {
    it("renders the movie detail page", async () => {
      renderRoute("/movie/550");

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Movie Detail" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /search", () => {
    it("renders the search results page", async () => {
      renderRoute("/search");

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "Search Results" }),
        ).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to an unknown route", () => {
    it("renders the 404 page", async () => {
      renderRoute("/this-does-not-exist");

      await waitFor(() => {
        expect(
          screen.getByRole("heading", { name: "404" }),
        ).toBeInTheDocument();
      });
    });
  });
});
