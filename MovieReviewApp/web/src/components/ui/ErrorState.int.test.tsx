import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ErrorState } from "~/components/ui/ErrorState.js";

describe("<ErrorState/>", () => {
  describe("when rendering with a message and retry callback", () => {
    it("displays an error icon", () => {
      render(<ErrorState message="Failed to load movies" onRetry={() => {}} />);

      expect(screen.getByTestId("error-icon")).toBeInTheDocument();
    });

    it("displays the error message", () => {
      render(<ErrorState message="Failed to load movies" onRetry={() => {}} />);

      expect(screen.getByText("Failed to load movies")).toBeInTheDocument();
    });

    it("displays a Try Again button", () => {
      render(<ErrorState message="Failed to load movies" onRetry={() => {}} />);

      expect(
        screen.getByRole("button", { name: "Try Again" }),
      ).toBeInTheDocument();
    });

    it("calls onRetry when Try Again is clicked", async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState message="Failed to load movies" onRetry={onRetry} />);

      await user.click(screen.getByRole("button", { name: "Try Again" }));

      expect(onRetry).toHaveBeenCalledOnce();
    });
  });

  describe("when no retry callback is provided", () => {
    it("does not display a Try Again button", () => {
      render(<ErrorState message="Something went wrong" />);

      expect(
        screen.queryByRole("button", { name: "Try Again" }),
      ).not.toBeInTheDocument();
    });
  });
});
