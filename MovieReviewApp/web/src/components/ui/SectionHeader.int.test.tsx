import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { SectionHeader } from "~/components/ui/SectionHeader.js";

function renderSectionHeader(props: Parameters<typeof SectionHeader>[0]) {
  return render(
    <MemoryRouter>
      <SectionHeader {...props} />
    </MemoryRouter>,
  );
}

describe("<SectionHeader/>", () => {
  describe("when title and href are provided", () => {
    it("displays the heading", () => {
      renderSectionHeader({ title: "Popular Movies", href: "/movies/popular" });

      expect(
        screen.getByRole("heading", { name: "Popular Movies" }),
      ).toBeInTheDocument();
    });

    it("displays a See All link pointing to the href", () => {
      renderSectionHeader({ title: "Popular Movies", href: "/movies/popular" });

      const link = screen.getByRole("link", { name: /See All/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "/movies/popular");
    });
  });

  describe("when no href is provided", () => {
    it("displays the heading", () => {
      renderSectionHeader({ title: "Search Results" });

      expect(
        screen.getByRole("heading", { name: "Search Results" }),
      ).toBeInTheDocument();
    });

    it("does not display a See All link", () => {
      renderSectionHeader({ title: "Search Results" });

      expect(
        screen.queryByRole("link", { name: /See All/i }),
      ).not.toBeInTheDocument();
    });
  });
});
