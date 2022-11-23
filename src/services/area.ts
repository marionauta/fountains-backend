import * as logger from "deno/log/mod.ts";
import { AreaDto, osmIntoDto } from "@/models/areaDto.ts";
import { query as queryArea } from "@/osm/nominatim.ts";

let area: AreaDto | undefined;

export const getArea = async (): Promise<AreaDto> => {
  if (area) {
    return area;
  }
  const areaName = Deno.env.get("FOUNTAINS_AREA");
  if (!areaName) {
    logger.critical("FOUNTAINS_AREA is not defined");
    Deno.exit(1);
  }
  logger.info(`Retrieving area info for: ${areaName}`);
  const areaOsm = await queryArea(areaName);
  if (areaOsm === null) {
    logger.critical(`No area found for: ${areaName}`);
    Deno.exit(1);
  }
  area = osmIntoDto(areaOsm);
  return area;
};
