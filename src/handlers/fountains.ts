import { Handler } from "deno/http/server.ts";
import { Status } from "deno/http/http_status.ts";
import * as logger from "deno/log/mod.ts";
import { osmIntoDto } from "@/models/drinkingFountainDto.ts";
import { serverResponse } from "@/models/server_response.ts";
import { getArea, getFountains } from "@/services/mod.ts";
import { getAreaId } from "@/osm/nominatim.ts";

const serveFountains: Handler = async () => {
  const { osmId, osmType } = await getArea();
  const areaId = getAreaId(osmType, osmId);
  if (!areaId) {
    logger.error(`No areaId for osmId ${osmId} and osmType ${osmType}`);
    return new Response(null, { status: Status.InternalServerError });
  }
  const { fountains, lastUpdated } = await getFountains(areaId);
  const data = {
    lastUpdated,
    fountains: fountains.map(osmIntoDto),
  };
  return new Response(serverResponse({ data }));
};

export default serveFountains;
