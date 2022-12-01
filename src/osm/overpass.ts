interface OverpassResponse<T> {
  elements: T[];
}

export interface FountainOsm {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

export const query = async (areaId: number): Promise<FountainOsm[]> => {
  const data = `
    [out:json];
    area(${areaId});
    node[amenity=drinking_water](area);
    out;
  `;
  const url = `http://overpass-api.de/api/interpreter?data=${
    encodeURIComponent(data)
  }`;
  const response: OverpassResponse<FountainOsm> = await fetch(url)
    .then((res) => res.json());
  return response.elements;
};
