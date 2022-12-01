import { getLanguageString } from "@/services/mod.ts";

export interface AreaOsm {
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  importance: number;
}

export const query = async (name: string): Promise<AreaOsm | null> => {
  const url =
    `https://nominatim.openstreetmap.org/search?q=${name}&format=json`;

  const headers = new Headers();
  const language = getLanguageString();
  if (language != undefined) {
    headers.set("accept-language", language);
  }

  const areas: [AreaOsm] = await fetch(encodeURI(url), { headers })
    .then((res) => res.json());
  const area = areas.reduce((acc, area) =>
    acc.importance > area.importance ? acc : area
  );
  return area;
};

export const getAreaId = (type: string, id: number): number | null => {
  switch (type) {
    case "way":
      return id + 2400000000;
    case "relation":
      return id + 3600000000;
    default:
      return null;
  }
};
