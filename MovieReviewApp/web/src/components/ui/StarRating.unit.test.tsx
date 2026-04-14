import { render, screen } from "@testing-library/react";
import { StarRating } from "~/components/ui/StarRating.js";

describe("<StarRating/>", () => {
  describe("when rating is 7.5 out of 10", () => {
    it("displays 4 filled stars (7.5/10 * 5 = 3.75, rounds to 4)", () => {
      render(<StarRating rating={7.5} />);

      const fullStars = screen.getAllByTestId("star-full");
      const emptyStars = screen.getAllByTestId("star-empty");

      expect(fullStars).toHaveLength(4);
      expect(emptyStars).toHaveLength(1);
    });

    it("displays the numeric rating 7.5", () => {
      render(<StarRating rating={7.5} />);

      expect(screen.getByText("7.5")).toBeInTheDocument();
    });

    it("exposes an accessible img role with the rating label", () => {
      render(<StarRating rating={7.5} />);

      expect(
        screen.getByRole("img", { name: /Rating: 7.5 out of 10/ }),
      ).toBeInTheDocument();
    });
  });

  describe("when rating is 0", () => {
    it("displays all empty stars", () => {
      render(<StarRating rating={0} />);

      const emptyStars = screen.getAllByTestId("star-empty");
      expect(emptyStars).toHaveLength(5);
      expect(screen.queryAllByTestId("star-full")).toHaveLength(0);
      expect(screen.queryAllByTestId("star-half")).toHaveLength(0);
    });

    it("displays the numeric rating 0", () => {
      render(<StarRating rating={0} />);

      expect(screen.getByText("0")).toBeInTheDocument();
    });
  });

  describe("when rating is 10", () => {
    it("displays all 5 filled stars", () => {
      render(<StarRating rating={10} />);

      const fullStars = screen.getAllByTestId("star-full");
      expect(fullStars).toHaveLength(5);
      expect(screen.queryAllByTestId("star-empty")).toHaveLength(0);
      expect(screen.queryAllByTestId("star-half")).toHaveLength(0);
    });

    it("displays the numeric rating 10", () => {
      render(<StarRating rating={10} />);

      expect(screen.getByText("10")).toBeInTheDocument();
    });
  });

  describe("when rating produces half stars", () => {
    it("displays 1 half star for rating 1 (0.5 scaled)", () => {
      render(<StarRating rating={1} />);

      expect(screen.getAllByTestId("star-half")).toHaveLength(1);
      expect(screen.getAllByTestId("star-empty")).toHaveLength(4);
    });

    it("displays correct stars for rating 5 (2.5 scaled)", () => {
      render(<StarRating rating={5} />);

      expect(screen.getAllByTestId("star-full")).toHaveLength(2);
      expect(screen.getAllByTestId("star-half")).toHaveLength(1);
      expect(screen.getAllByTestId("star-empty")).toHaveLength(2);
    });
  });

  describe("when custom maxStars is provided", () => {
    it("renders the specified number of stars", () => {
      render(<StarRating rating={10} maxStars={3} />);

      const fullStars = screen.getAllByTestId("star-full");
      expect(fullStars).toHaveLength(3);
    });
  });
});
