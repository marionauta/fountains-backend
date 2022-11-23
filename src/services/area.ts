import * as logger from "deno/log/mod.ts";
import { AreaOsm, query as queryArea } from "@/osm/nominatim.ts";

let area: AreaOsm | undefined;

export const getArea = async (): Promise<AreaOsm> => {
  if (area) {
    return area;
  }
  const areaName = Deno.env.get("FOUNTAINS_AREA");
  if (!areaName) {
    logger.critical("FOUNTAINS_AREA is not defined");
    Deno.exit(1);
  }
  logger.info(`Retrieving area info for: ${areaName}`);
  const _area = await queryArea(areaName);
  if (_area === null) {
    logger.critical(`No area found for: ${areaName}`);
    Deno.exit(1);
  }
  area = _area;
  return area;
};
