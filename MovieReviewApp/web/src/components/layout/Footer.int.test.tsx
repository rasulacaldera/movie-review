import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Layout } from "~/components/layout/Layout.js";

function renderWithRouter() {
  const router = createMemoryRouter(
    [
      {
        element: <Layout />,
        children: [{ path: "/", element: <h1>Home</h1> }],
      },
    ],
    { initialEntries: ["/"] },
  );

  return render(<RouterProvider router={router} />);
}

describe("<Footer/>", () => {
  describe("when viewing the footer", () => {
    it("displays a copyright notice", () => {
      renderWithRouter();

      const year = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`${year}`))).toBeInTheDocument();
    });

    it("displays a link to TMDB attribution", () => {
      renderWithRouter();

      const tmdbLink = screen.getByRole("link", { name: "TMDB" });
      expect(tmdbLink).toBeInTheDocument();
      expect(tmdbLink).toHaveAttribute("href", "https://www.themoviedb.org/");
    });
  });
});
