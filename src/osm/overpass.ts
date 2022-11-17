import { AreaRaw, getAreaId } from "./nominatim.ts";

interface OverpassResponse<T> {
  elements: [T];
}

export interface FountainRaw {
  id: number;
  lat: number;
  lng: number;
}

export const query = async (area: AreaRaw): Promise<[FountainRaw]> => {
  const areaId = getAreaId(area);
  if (areaId === null) {
    throw "areaId is null";
  }
  const url =
    `http://overpass-api.de/api/interpreter?data=[timeout:25][out:json];area(${areaId})->.searchArea;(node["amenity"="drinking_water"](area.searchArea);); out body;`;
  const response: OverpassResponse<FountainRaw> = await fetch(encodeURI(url))
    .then((res) => res.json());
  return response.elements;
};
