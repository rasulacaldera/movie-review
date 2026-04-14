import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { EmptyState } from "~/components/ui/EmptyState.js";

function renderEmptyState(props: Parameters<typeof EmptyState>[0]) {
  return render(
    <MemoryRouter>
      <EmptyState {...props} />
    </MemoryRouter>,
  );
}

describe("<EmptyState/>", () => {
  describe("when rendering with message and action", () => {
    it("displays an empty state icon", () => {
      renderEmptyState({
        message: "No movies found",
        actionLabel: "Browse Popular",
        actionHref: "/popular",
      });

      expect(screen.getByTestId("empty-icon")).toBeInTheDocument();
    });

    it("displays the message", () => {
      renderEmptyState({
        message: "No movies found",
        actionLabel: "Browse Popular",
        actionHref: "/popular",
      });

      expect(screen.getByText("No movies found")).toBeInTheDocument();
    });

    it("displays the action button linking to the href", () => {
      renderEmptyState({
        message: "No movies found",
        actionLabel: "Browse Popular",
        actionHref: "/popular",
      });

      const link = screen.getByRole("link", { name: "Browse Popular" });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/popular");
    });
  });

  describe("when no action is provided", () => {
    it("does not display an action button", () => {
      renderEmptyState({ message: "Nothing here" });

      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });
  });
});
