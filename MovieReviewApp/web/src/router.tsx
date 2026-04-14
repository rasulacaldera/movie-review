import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Layout } from "~/components/layout/Layout.js";

const HomePage = lazy(() => import("~/pages/HomePage.js"));
const ComingSoonPage = lazy(() => import("~/pages/ComingSoonPage.js"));
const TopRatedPage = lazy(() => import("~/pages/TopRatedPage.js"));
const PopularPage = lazy(() => import("~/pages/PopularPage.js"));
const MovieDetailPage = lazy(() => import("~/pages/MovieDetailPage.js"));
const SearchPage = lazy(() => import("~/pages/SearchPage.js"));
const NotFoundPage = lazy(() => import("~/pages/NotFoundPage.js"));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<div className="p-8">Loading...</div>}>{children}</Suspense>;
}

export const router = createBrowserRouter([
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
]);
