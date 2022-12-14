import { FountainOsm } from "@/osm/overpass.ts";

import { LocationDto } from "./locationDto.ts";
import { PropertiesDto } from "./propertiesDto.ts";

export interface DrinkingFountainDto {
  id: string;
  name: string;
  location: LocationDto;
  properties: PropertiesDto;
}

export const osmIntoDto = (osm: FountainOsm): DrinkingFountainDto => {
  return {
    id: osm.id.toString(),
    name: osm.tags["name"] ?? "",
    location: {
      latitude: osm.lat,
      longitude: osm.lon,
    },
    properties: {
      bottle: osm.tags["bottle"] || "unknown",
      wheelchair: osm.tags["wheelchair"] || "unknown",
    },
  };
};
