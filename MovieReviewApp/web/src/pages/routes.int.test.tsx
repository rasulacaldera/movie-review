import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { Layout } from "~/components/layout/Layout.js";

const HomePage = lazy(() => import("~/pages/HomePage.js"));
const ComingSoonPage = lazy(() => import("~/pages/ComingSoonPage.js"));
const TopRatedPage = lazy(() => import("~/pages/TopRatedPage.js"));
const PopularPage = lazy(() => import("~/pages/PopularPage.js"));
const MovieDetailPage = lazy(() => import("~/pages/MovieDetailPage.js"));
const SearchPage = lazy(() => import("~/pages/SearchPage.js"));
const NotFoundPage = lazy(() => import("~/pages/NotFoundPage.js"));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>;
}

const routes = [
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <SuspenseWrapper>
            <HomePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/coming-soon",
        element: (
          <SuspenseWrapper>
            <ComingSoonPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/top-rated",
        element: (
          <SuspenseWrapper>
            <TopRatedPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/popular",
        element: (
          <SuspenseWrapper>
            <PopularPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/movie/:id",
        element: (
          <SuspenseWrapper>
            <MovieDetailPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "/search",
        element: (
          <SuspenseWrapper>
            <SearchPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: "*",
        element: (
          <SuspenseWrapper>
            <NotFoundPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },
];

function renderRoute(path: string) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(<RouterProvider router={router} />);
}

describe("Route stubs", () => {
  describe("when navigating to /", () => {
    it("renders the home page", async () => {
      renderRoute("/");

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Home" })).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /coming-soon", () => {
    it("renders the coming soon page", async () => {
      renderRoute("/coming-soon");

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Coming Soon" })).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /top-rated", () => {
    it("renders the top rated page", async () => {
      renderRoute("/top-rated");

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Top Rated" })).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /popular", () => {
    it("renders the popular page", async () => {
      renderRoute("/popular");

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Popular" })).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /movie/:id", () => {
    it("renders the movie detail page", async () => {
      renderRoute("/movie/550");

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Movie Detail" })).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to /search", () => {
    it("renders the search results page", async () => {
      renderRoute("/search");

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "Search Results" })).toBeInTheDocument();
      });
    });
  });

  describe("when navigating to an unknown route", () => {
    it("renders the 404 page", async () => {
      renderRoute("/this-does-not-exist");

      await waitFor(() => {
        expect(screen.getByRole("heading", { name: "404" })).toBeInTheDocument();
      });
    });
  });
});
