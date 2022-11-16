const url = `https://nominatim.openstreetmap.org/search?q=Sevilla%2C+Spain&format=json`

function getAreaId(type: string, id: number): number | null {
    switch (type) {
        case "way":
            return id + 2400000000
        case "relation":
            return id + 3600000000
        default:
            return null
    }
}

interface Area {
    osm_type: string;
    osm_id: number;
    importance: number;
}

interface FountainRaw {
    id: number;
    lat: number;
    lng: number;
}

const areas = await fetch(url)
    .then(res => res.json() as Promise<[Area]>)

const area = areas.reduce((acc, area) => acc.importance > area.importance ? acc : area)
console.log(area)
const areaId = getAreaId(area.osm_type, area.osm_id);
console.log(areaId)

const overpassUrl = `http://overpass-api.de/api/interpreter?data=[timeout:25][out:json];area(${areaId})-%3E.searchArea;(node[%22amenity%22=%22drinking_water%22](area.searchArea););+out+body;`
console.log(overpassUrl)

const fountains = await fetch(overpassUrl)
    .then(res => res.json())
    .then(res => res.elements as [FountainRaw]);

console.log(fountains.length);
