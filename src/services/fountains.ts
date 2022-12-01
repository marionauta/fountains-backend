import * as logger from "deno/log/mod.ts";
import { FountainOsm, query as queryFountains } from "@/osm/overpass.ts";
import { getCacheTime } from "@/services/mod.ts";

let lastUpdated: Date | undefined;
let fountains: FountainOsm[] = [];

export const getFountains = async (areaId: number) => {
  if (
    lastUpdated === undefined ||
    new Date().getTime() - lastUpdated.getTime() > getCacheTime()
  ) {
    logger.info(`Retrieving fountains for areaId: ${areaId}`);
    fountains = await queryFountains(areaId);
    lastUpdated = new Date();
  }
  return { fountains, lastUpdated };
};
