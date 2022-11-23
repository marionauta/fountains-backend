import { AreaOsm } from "@/osm/nominatim.ts";

export interface AreaDto {
  osmId: number;
  osmType: string;
}

export const osmIntoDto = (area: AreaOsm): AreaDto => ({
  osmId: area.osm_id,
  osmType: area.osm_type,
});
