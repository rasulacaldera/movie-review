import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MovieCard } from "~/components/ui/MovieCard.js";

function renderMovieCard(overrides: Partial<Parameters<typeof MovieCard>[0]> = {}) {
  const defaultProps = {
    tmdbId: 550,
    title: "Inception",
    year: 2010,
    posterPath: "/abc.jpg",
    tmdbRating: 8.8,
    ...overrides,
  };

  return render(
    <MemoryRouter>
      <MovieCard {...defaultProps} />
    </MemoryRouter>,
  );
}

describe("<MovieCard/>", () => {
  describe("when rendering a movie card with core info", () => {
    it("displays the movie poster image", () => {
      renderMovieCard();

      const img = screen.getByAltText("Inception poster");
      expect(img).toBeInTheDocument();
      expect(img).toHaveAttribute("src", expect.stringContaining("/abc.jpg"));
    });

    it("displays the title", () => {
      renderMovieCard();

      expect(screen.getByText("Inception")).toBeInTheDocument();
    });

    it("displays the year", () => {
      renderMovieCard();

      expect(screen.getByText("2010")).toBeInTheDocument();
    });

    it("displays the rating badge", () => {
      renderMovieCard();

      expect(screen.getByText("8.8")).toBeInTheDocument();
    });
  });

  describe("when posterPath is null", () => {
    it("displays a placeholder image", () => {
      renderMovieCard({ posterPath: null, title: "No Poster" });

      expect(screen.getByLabelText("No Poster poster placeholder")).toBeInTheDocument();
    });
  });

  describe("when clicking the movie card", () => {
    it("links to the movie detail route", () => {
      renderMovieCard({ tmdbId: 550 });

      const link = screen.getByRole("link");
      expect(link).toHaveAttribute("href", "/movie/550");
    });
  });
});
