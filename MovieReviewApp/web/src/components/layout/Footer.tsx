/** Site footer with copyright and TMDB attribution. */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card px-4 py-6">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-2 text-sm text-muted-foreground sm:flex-row sm:justify-between">
        <p>&copy; {year} MovieReview. All rights reserved.</p>
        <p>
          Powered by{" "}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground underline hover:text-primary"
          >
            TMDB
          </a>
        </p>
      </div>
    </footer>
  );
}
