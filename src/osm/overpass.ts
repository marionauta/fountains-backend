import { AreaRaw, getAreaId } from "./nominatim.ts";

interface OverpassResponse<T> {
  elements: [T];
}

export interface FountainRaw {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

export const query = async (area: AreaRaw): Promise<[FountainRaw]> => {
  const areaId = getAreaId(area);
  if (areaId === null) {
    throw "areaId is null";
  }
  const data = `
    [out:json];
    area(${areaId});
    node[amenity=drinking_water](area);
    out;
  `;
  const url = `http://overpass-api.de/api/interpreter?data=${
    encodeURIComponent(data)
  }`;
  const response: OverpassResponse<FountainRaw> = await fetch(url)
    .then((res) => res.json());
  return response.elements;
};
