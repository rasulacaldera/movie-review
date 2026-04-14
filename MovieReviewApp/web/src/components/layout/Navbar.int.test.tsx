import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Layout } from "~/components/layout/Layout.js";

function renderWithRouter(initialPath = "/") {
  const router = createMemoryRouter(
    [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <h1>Home</h1> },
          { path: "/coming-soon", element: <h1>Coming Soon</h1> },
          { path: "/top-rated", element: <h1>Top Rated</h1> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return render(<RouterProvider router={router} />);
}

describe("<Navbar/>", () => {
  describe("when viewing the navbar", () => {
    it("displays the app logo/title linking to home", () => {
      renderWithRouter();

      const logoLink = screen.getByRole("link", { name: /MovieReview/i });
      expect(logoLink).toBeInTheDocument();
      expect(logoLink).toHaveAttribute("href", "/");
    });

    it("displays a search input", () => {
      renderWithRouter();

      expect(screen.getByLabelText("Search movies")).toBeInTheDocument();
    });

    it("displays navigation links for Home, Coming Soon, and Top Rated", () => {
      renderWithRouter();

      expect(screen.getByRole("link", { name: "Home" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Coming Soon" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Top Rated" })).toBeInTheDocument();
    });

    it("displays a Sign In button", () => {
      renderWithRouter();

      expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
    });
  });

  describe("when clicking the Coming Soon nav link", () => {
    it("navigates to the coming soon page route", async () => {
      const user = userEvent.setup();
      renderWithRouter("/");

      const comingSoonLink = screen.getByRole("link", { name: "Coming Soon" });
      await user.click(comingSoonLink);

      expect(screen.getByRole("heading", { name: "Coming Soon" })).toBeInTheDocument();
    });
  });
});
