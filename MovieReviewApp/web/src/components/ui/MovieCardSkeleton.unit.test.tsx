import { render, screen } from "@testing-library/react";
import { MovieCardSkeleton, SkeletonGrid } from "~/components/ui/MovieCardSkeleton.js";

describe("<MovieCardSkeleton/>", () => {
  describe("when rendered", () => {
    it("displays animated placeholder for poster", () => {
      render(<MovieCardSkeleton />);

      const skeleton = screen.getByTestId("movie-card-skeleton");
      const posterPlaceholder = skeleton.querySelector(".animate-pulse.aspect-\\[2\\/3\\]");
      expect(posterPlaceholder).toBeInTheDocument();
    });

    it("displays animated placeholder for title", () => {
      render(<MovieCardSkeleton />);

      expect(screen.getByTestId("skeleton-title")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-title")).toHaveClass("animate-pulse");
    });

    it("displays animated placeholder for rating", () => {
      render(<MovieCardSkeleton />);

      expect(screen.getByTestId("skeleton-rating")).toBeInTheDocument();
      expect(screen.getByTestId("skeleton-rating")).toHaveClass("animate-pulse");
    });
  });
});

describe("<SkeletonGrid/>", () => {
  describe("when count is 6", () => {
    it("renders 6 skeleton cards", () => {
      render(<SkeletonGrid count={6} />);

      const skeletons = screen.getAllByTestId("movie-card-skeleton");
      expect(skeletons).toHaveLength(6);
    });
  });

  describe("when count is 3", () => {
    it("renders 3 skeleton cards", () => {
      render(<SkeletonGrid count={3} />);

      const skeletons = screen.getAllByTestId("movie-card-skeleton");
      expect(skeletons).toHaveLength(3);
    });
  });
});
