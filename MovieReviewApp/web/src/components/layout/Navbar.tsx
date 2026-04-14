import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Film, Menu, Search, X } from "lucide-react";
import { cn } from "~/lib/utils.js";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/coming-soon", label: "Coming Soon" },
  { to: "/top-rated", label: "Top Rated" },
] as const;

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return cn(
    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-accent text-accent-foreground"
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
  );
}

/** Reusable search input with icon. */
function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="search"
        placeholder="Search movies..."
        aria-label="Search movies"
        className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

/** Main navigation bar with logo, search, nav links, and sign in. */
export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav
      aria-label="Main navigation"
      className="border-b border-border bg-card"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-lg font-bold text-foreground"
        >
          <Film className="h-6 w-6 text-primary" />
          <span>MovieReview</span>
        </Link>

        {/* Search input — desktop */}
        <div className="mx-4 hidden flex-1 md:block md:max-w-md">
          <SearchInput />
        </div>

        {/* Desktop nav links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={navLinkClassName}
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            className="ml-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
          >
            Sign In
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="rounded-lg p-2 text-foreground md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-nav-menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-menu"
          className="border-t border-border px-4 pb-4 md:hidden"
        >
          {/* Search input — mobile */}
          <div className="mt-3">
            <SearchInput />
          </div>

          <div className="mt-3 flex flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === "/"}
                onClick={() => setMobileMenuOpen(false)}
                className={navLinkClassName}
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              className="mt-2 rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent"
            >
              Sign In
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
