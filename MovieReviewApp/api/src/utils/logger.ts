import pino, { type LoggerOptions } from "pino";
import { getRequestContext } from "../middleware/request-context.js";
import { config } from "../config.js";

export function createLogger(name: string) {
  const options: LoggerOptions = {
    name,
    level: config.LOG_LEVEL,
    mixin() {
      return getRequestContext() ?? {};
    },
  };

  if (config.NODE_ENV === "development") {
    options.transport = { target: "pino-pretty" };
  }

  return pino(options);
}
