import { AreaOsm } from "@/osm/nominatim.ts";
import { LocationDto } from "@/models/locationDto.ts";

export interface AreaDto {
  osmId: number;
  osmType: string;
  displayName: string;
  location: LocationDto;
}

export const osmIntoDto = (area: AreaOsm): AreaDto => ({
  osmId: area.osm_id,
  osmType: area.osm_type,
  displayName: trimDisplayName(area.display_name),
  location: {
    latitude: parseFloat(area.lat),
    longitude: parseFloat(area.lon),
  },
});

function trimDisplayName(displayName: string): string {
  const parts = displayName
    .split(",")
    .map((part) => part.trim())
    .filter((part) => !part.match(/^\d+$/));
  if (parts.length <= 3) {
    return parts.join(", ");
  }
  const selected = [parts[0], parts[parts.length - 2], parts[parts.length - 1]];
  return selected.join(", ");
}
