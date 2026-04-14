import { createApp } from "./app.js";
import { config } from "./config.js";
import { createLogger } from "./utils/logger.js";
import { TmdbGateway } from "./infrastructure/tmdb/tmdb.gateway.js";
import { MoviesService } from "./domains/movies/movies.service.js";

const logger = createLogger("server");

const tmdbGateway = new TmdbGateway({
  baseUrl: config.TMDB_BASE_URL,
  readAccessToken: config.TMDB_READ_ACCESS_TOKEN,
});
const moviesService = MoviesService.create(tmdbGateway);

const app = createApp({ moviesService });

app.listen(config.PORT, config.HOST, () => {
  logger.info(
    { port: config.PORT, host: config.HOST },
    "Server started",
  );
});
