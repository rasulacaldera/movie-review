import { describe, it, expect } from "vitest";
import {
  normalizeMovieSummary,
  normalizeMovieList,
  normalizeMovieDetail,
  normalizeCredits,
  normalizeVideos,
  normalizeImageConfiguration,
} from "./movies.normalizer.js";
import type {
  TmdbMovieListItem,
  TmdbPaginatedResponse,
  TmdbMovieDetail,
  TmdbCreditsResponse,
  TmdbVideosResponse,
  TmdbImageConfiguration,
} from "../../infrastructure/tmdb/tmdb.types.js";

describe("movies.normalizer", () => {
  describe("normalizeMovieSummary()", () => {
    const rawItem: TmdbMovieListItem = {
      id: 550,
      title: "Fight Club",
      poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
      vote_average: 8.4,
      release_date: "1999-10-15",
      genre_ids: [18, 53],
      overview: "A ticking-Loss emotional journey",
      backdrop_path: "/hZkgoQYus5dXo3H8T7Uef6DNknx.jpg",
    };

    describe("when given a raw TMDB movie response with snake_case fields", () => {
      it("maps id to tmdbId", () => {
        const result = normalizeMovieSummary(rawItem);
        expect(result.tmdbId).toBe(550);
      });

      it("preserves title", () => {
        const result = normalizeMovieSummary(rawItem);
        expect(result.title).toBe("Fight Club");
      });

      it("extracts year from release_date", () => {
        const result = normalizeMovieSummary(rawItem);
        expect(result.year).toBe(1999);
      });

      it("keeps poster_path as a relative posterPath", () => {
        const result = normalizeMovieSummary(rawItem);
        expect(result.posterPath).toBe("/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg");
      });

      it("maps vote_average to tmdbRating", () => {
        const result = normalizeMovieSummary(rawItem);
        expect(result.tmdbRating).toBe(8.4);
      });

      it("maps release_date to releaseDate", () => {
        const result = normalizeMovieSummary(rawItem);
        expect(result.releaseDate).toBe("1999-10-15");
      });

      it("maps genre_ids to genre names", () => {
        const result = normalizeMovieSummary(rawItem);
        expect(result.genres).toEqual(["Drama", "Thriller"]);
      });
    });

    describe("when genre_ids contain unknown IDs", () => {
      it("filters out unknown genre IDs", () => {
        const item: TmdbMovieListItem = {
          ...rawItem,
          genre_ids: [18, 99999],
        };
        const result = normalizeMovieSummary(item);
        expect(result.genres).toEqual(["Drama"]);
      });
    });

    describe("when release_date is empty", () => {
      it("returns null for year", () => {
        const item: TmdbMovieListItem = {
          ...rawItem,
          release_date: "",
        };
        const result = normalizeMovieSummary(item);
        expect(result.year).toBeNull();
      });
    });
  });

  describe("normalizeMovieList()", () => {
    describe("when given a paginated TMDB response", () => {
      it("normalizes all results and pagination fields", () => {
        const raw: TmdbPaginatedResponse<TmdbMovieListItem> = {
          results: [
            {
              id: 550,
              title: "Fight Club",
              poster_path: "/poster.jpg",
              vote_average: 8.4,
              release_date: "1999-10-15",
              genre_ids: [18],
              overview: "Overview",
              backdrop_path: null,
            },
          ],
          page: 2,
          total_pages: 10,
          total_results: 200,
        };

        const result = normalizeMovieList(raw);

        expect(result.page).toBe(2);
        expect(result.totalPages).toBe(10);
        expect(result.totalResults).toBe(200);
        expect(result.results).toHaveLength(1);
        expect(result.results[0]!.tmdbId).toBe(550);
      });
    });
  });

  describe("normalizeMovieDetail()", () => {
    const rawDetail: TmdbMovieDetail = {
      id: 550,
      title: "Fight Club",
      overview: "An insomniac office worker...",
      genres: [
        { id: 18, name: "Drama" },
        { id: 53, name: "Thriller" },
      ],
      runtime: 139,
      release_date: "1999-10-15",
      poster_path: "/poster.jpg",
      backdrop_path: "/backdrop.jpg",
      vote_average: 8.4,
    };

    describe("when given a raw TMDB movie detail response", () => {
      it("maps overview to synopsis", () => {
        const result = normalizeMovieDetail(rawDetail);
        expect(result.synopsis).toBe("An insomniac office worker...");
      });

      it("keeps backdrop_path as a relative backdropPath", () => {
        const result = normalizeMovieDetail(rawDetail);
        expect(result.backdropPath).toBe("/backdrop.jpg");
      });

      it("preserves runtime as minutes", () => {
        const result = normalizeMovieDetail(rawDetail);
        expect(result.runtime).toBe(139);
      });

      it("extracts genre names from genres array", () => {
        const result = normalizeMovieDetail(rawDetail);
        expect(result.genres).toEqual(["Drama", "Thriller"]);
      });

      it("maps vote_average to tmdbRating", () => {
        const result = normalizeMovieDetail(rawDetail);
        expect(result.tmdbRating).toBe(8.4);
      });
    });

    describe("when poster_path and backdrop_path are null", () => {
      it("returns null for posterPath and backdropPath without error", () => {
        const detail: TmdbMovieDetail = {
          ...rawDetail,
          poster_path: null,
          backdrop_path: null,
        };
        const result = normalizeMovieDetail(detail);
        expect(result.posterPath).toBeNull();
        expect(result.backdropPath).toBeNull();
      });
    });
  });

  describe("normalizeCredits()", () => {
    const rawCredits: TmdbCreditsResponse = {
      cast: [
        {
          name: "Brad Pitt",
          character: "Tyler Durden",
          profile_path: "/profile.jpg",
        },
        {
          name: "Edward Norton",
          character: "The Narrator",
          profile_path: null,
        },
      ],
      crew: [
        { name: "David Fincher", job: "Director", department: "Directing" },
        { name: "Jim Uhls", job: "Screenplay", department: "Writing" },
      ],
    };

    describe("when given a raw TMDB credits response", () => {
      it("normalizes cast members with name, character, and profilePath", () => {
        const result = normalizeCredits(rawCredits);
        expect(result.cast).toEqual([
          {
            name: "Brad Pitt",
            character: "Tyler Durden",
            profilePath: "/profile.jpg",
          },
          {
            name: "Edward Norton",
            character: "The Narrator",
            profilePath: null,
          },
        ]);
      });

      it("extracts the director from the crew list", () => {
        const result = normalizeCredits(rawCredits);
        expect(result.director).toBe("David Fincher");
      });
    });

    describe("when no director is in the crew", () => {
      it("returns null for director", () => {
        const credits: TmdbCreditsResponse = {
          cast: [],
          crew: [
            { name: "Jim Uhls", job: "Screenplay", department: "Writing" },
          ],
        };
        const result = normalizeCredits(credits);
        expect(result.director).toBeNull();
      });
    });
  });

  describe("normalizeVideos()", () => {
    const rawVideos: TmdbVideosResponse = {
      results: [
        {
          name: "Official Trailer",
          key: "SUXWAEX2jlg",
          site: "YouTube",
          type: "Trailer",
        },
        {
          name: "Vimeo Clip",
          key: "abc123",
          site: "Vimeo",
          type: "Clip",
        },
        {
          name: "Behind the Scenes",
          key: "xyz789",
          site: "YouTube",
          type: "Behind the Scenes",
        },
      ],
    };

    describe("when given a raw TMDB videos response", () => {
      it("filters to YouTube videos only", () => {
        const result = normalizeVideos(rawVideos);
        expect(result).toHaveLength(2);
        expect(result.every((v) => v.youtubeKey !== "abc123")).toBe(true);
      });

      it("maps key to youtubeKey", () => {
        const result = normalizeVideos(rawVideos);
        expect(result[0]!.youtubeKey).toBe("SUXWAEX2jlg");
      });

      it("preserves name and type", () => {
        const result = normalizeVideos(rawVideos);
        expect(result[0]).toEqual({
          name: "Official Trailer",
          youtubeKey: "SUXWAEX2jlg",
          type: "Trailer",
        });
      });
    });
  });

  describe("normalizeImageConfiguration()", () => {
    describe("when given a raw TMDB configuration response", () => {
      it("extracts baseUrl, posterSizes, and backdropSizes", () => {
        const raw: TmdbImageConfiguration = {
          images: {
            secure_base_url: "https://image.tmdb.org/t/p/",
            poster_sizes: ["w92", "w154", "w185", "w342", "w500", "w780", "original"],
            backdrop_sizes: ["w300", "w780", "w1280", "original"],
          },
        };

        const result = normalizeImageConfiguration(raw);

        expect(result.baseUrl).toBe("https://image.tmdb.org/t/p/");
        expect(result.posterSizes).toEqual([
          "w92", "w154", "w185", "w342", "w500", "w780", "original",
        ]);
        expect(result.backdropSizes).toEqual([
          "w300", "w780", "w1280", "original",
        ]);
      });
    });
  });
});
