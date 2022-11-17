export interface AreaRaw {
  osm_type: string;
  osm_id: number;
  importance: number;
}

export const query = async (name: string): Promise<AreaRaw | null> => {
  const url =
    `https://nominatim.openstreetmap.org/search?q=${name}&format=json`;
  const areas: [AreaRaw] = await fetch(encodeURI(url))
    .then((res) => res.json());
  const area = areas.reduce((acc, area) =>
    acc.importance > area.importance ? acc : area
  );
  return area;
};

export const getAreaId = (area: AreaRaw): number | null => {
  switch (area.osm_type) {
    case "way":
      return area.osm_id + 2400000000;
    case "relation":
      return area.osm_id + 3600000000;
    default:
      return null;
  }
};