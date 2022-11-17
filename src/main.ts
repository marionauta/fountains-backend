import { query as queryArea } from "./osm/nominatim.ts";
import { query as queryFountains } from "./osm/overpass.ts";

const areaName = "Sevilla, Spain";

const area = await queryArea(areaName);
if (!area) {
  throw "Area not found";
}

const fountains = await queryFountains(area);

console.log(fountains.length);
