import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { MovieCard } from "~/components/ui/MovieCard.js";

function renderMovieCard(overrides: Partial<Parameters<typeof MovieCard>[0]> = {}) {
  const defaultProps = {
    tmdbId: 550,
    title: "Fight Club",
    year: 1999,
    posterPath: "/fight-club.jpg",
    tmdbRating: 8.4,
    ...overrides,
  };

  return render(
    <MemoryRouter>
      <MovieCard {...defaultProps} />
    </MemoryRouter>,
  );
}

describe("<MovieCard/>", () => {
  describe("when rendered with a poster", () => {
    it("renders poster image with alt text containing the movie title", () => {
      renderMovieCard({ title: "Inception", posterPath: "/inception.jpg" });

      const img = screen.getByAltText("Inception poster");
      expect(img).toBeInTheDocument();
      expect(img.tagName).toBe("IMG");
    });

    it("has an accessible link containing the movie title", () => {
      renderMovieCard({ title: "Inception", year: 2010, tmdbId: 27205 });

      const link = screen.getByRole("link", { name: "Inception (2010)" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/movie/27205");
    });
  });

  describe("when posterPath is null", () => {
    it("renders a placeholder instead of a broken image", () => {
      renderMovieCard({ title: "No Poster Movie", posterPath: null });

      const placeholder = screen.getByLabelText("No Poster Movie poster placeholder");
      expect(placeholder).toBeInTheDocument();
      expect(screen.queryByRole("img", { name: /poster$/i })).not.toBeInTheDocument();
    });
  });
});
