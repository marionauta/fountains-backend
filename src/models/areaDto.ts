import { AreaOsm } from "@/osm/nominatim.ts";
import { LocationDto } from "./locationDto.ts";

export interface AreaDto {
  osmId: number;
  osmType: string;
  displayName: string;
  location: LocationDto;
}

export const osmIntoDto = (area: AreaOsm): AreaDto => ({
  osmId: area.osm_id,
  osmType: area.osm_type,
  displayName: area.display_name,
  location: {
    latitude: parseFloat(area.lat),
    longitude: parseFloat(area.lon),
  },
});
