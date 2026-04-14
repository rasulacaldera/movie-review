import { createApp } from "./app.js";
import { config } from "./config.js";
import { createLogger } from "./utils/logger.js";

const logger = createLogger("server");
const app = createApp();

app.listen(config.PORT, config.HOST, () => {
  logger.info(
    { port: config.PORT, host: config.HOST },
    "Server started",
  );
});
