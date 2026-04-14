import {
  buildImageUrl,
  POSTER_SIZES,
  BACKDROP_SIZES,
} from "~/domains/movies/image.js";

describe("buildImageUrl()", () => {
  const baseUrl = "https://image.tmdb.org/t/p/";

  describe("when path is a valid string", () => {
    it("returns the full image URL", () => {
      const url = buildImageUrl({
        baseUrl,
        path: "/abc123.jpg",
        size: POSTER_SIZES.large,
      });

      expect(url).toBe("https://image.tmdb.org/t/p/w500/abc123.jpg");
    });

    it("uses the specified size", () => {
      const url = buildImageUrl({
        baseUrl,
        path: "/poster.jpg",
        size: BACKDROP_SIZES.medium,
      });

      expect(url).toBe("https://image.tmdb.org/t/p/w780/poster.jpg");
    });
  });

  describe("when path is null", () => {
    it("returns null", () => {
      const url = buildImageUrl({
        baseUrl,
        path: null,
        size: POSTER_SIZES.large,
      });

      expect(url).toBeNull();
    });
  });
});
