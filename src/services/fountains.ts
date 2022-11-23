import * as logger from "deno/log/mod.ts";
import { AreaOsm } from "@/osm/nominatim.ts";
import { FountainOsm, query as queryFountains } from "@/osm/overpass.ts";

// Cache time, in milliseconds. Defaults to 6 hours.
const cacheTime: number = parseInt(Deno.env.get("CACHE_TIME") || "", 10) ||
  6 * 60 * 60 * 1000;
logger.info(`Fountains cache time set to ${cacheTime}ms`);
let lastUpdated: Date | undefined;
let fountains: FountainOsm[] = [];

export const getFountains = async (area: AreaOsm) => {
  if (
    lastUpdated === undefined ||
    new Date().getTime() - lastUpdated.getTime() > cacheTime
  ) {
    logger.info(`Retrieving fountains for osm_id: ${area.osm_id}`);
    fountains = await queryFountains(area);
    lastUpdated = new Date();
  }
  return { fountains, lastUpdated };
};
