import pino, { Logger } from "pino";
import CONSTANTS from "./constants";

export const logger: Logger = pino({
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
    },
  },
  level: CONSTANTS.DEBUG_LEVEL || "debug",
});
