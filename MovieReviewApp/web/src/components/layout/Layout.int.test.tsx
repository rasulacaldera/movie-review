import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { Layout } from "~/components/layout/Layout.js";

function renderLayout(initialPath = "/") {
  const router = createMemoryRouter(
    [
      {
        element: <Layout />,
        children: [
          { path: "/", element: <h1>Home</h1> },
          { path: "*", element: <h1>Not Found</h1> },
        ],
      },
    ],
    { initialEntries: [initialPath] },
  );

  return render(<RouterProvider router={router} />);
}

describe("<Layout/>", () => {
  describe("when visiting the home page", () => {
    it("renders a navbar at the top", () => {
      renderLayout();

      expect(
        screen.getByRole("navigation", { name: "Main navigation" }),
      ).toBeInTheDocument();
    });

    it("renders a main content area", () => {
      renderLayout();

      expect(screen.getByRole("main")).toBeInTheDocument();
    });

    it("renders a footer at the bottom", () => {
      renderLayout();

      expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    });
  });
});
