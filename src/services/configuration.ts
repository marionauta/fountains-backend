import * as logger from "deno/log/mod.ts";

// Cache time, in milliseconds. Defaults to 6 hours.
const cacheTime: number = parseInt(Deno.env.get("CACHE_TIME") || "", 10) ||
  6 * 60 * 60 * 1000;
logger.info(`Fountains cache time set to ${cacheTime}ms`);

export const getCacheTime = (): number => {
  return cacheTime;
};

export const getLanguageString = (): string | undefined => {
  return Deno.env.get("LANGUAGE") || Deno.env.get("LANG");
};
