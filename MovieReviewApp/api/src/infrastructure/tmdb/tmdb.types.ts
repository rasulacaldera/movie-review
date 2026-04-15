/** Raw TMDB API response types. Internal to the infrastructure layer. */

export interface TmdbMovieListItem {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
  release_date: string;
  genre_ids: number[];
  overview: string;
  backdrop_path: string | null;
}

export interface TmdbPaginatedResponse<T> {
  results: T[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface TmdbMovieDetail {
  id: number;
  title: string;
  overview: string;
  genres: TmdbGenre[];
  runtime: number;
  release_date: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
}

export interface TmdbGenre {
  id: number;
  name: string;
}

export interface TmdbCastMember {
  cast_id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbCrewMember {
  name: string;
  job: string;
  department: string;
}

export interface TmdbCreditsResponse {
  cast: TmdbCastMember[];
  crew: TmdbCrewMember[];
}

export interface TmdbVideoResult {
  name: string;
  key: string;
  site: string;
  type: string;
}

export interface TmdbVideosResponse {
  results: TmdbVideoResult[];
}

export interface TmdbImageConfiguration {
  images: {
    secure_base_url: string;
    poster_sizes: string[];
    backdrop_sizes: string[];
  };
}

/** Mapping of TMDB genre IDs to names. */
export const TMDB_GENRE_MAP: Record<number, string> = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};
