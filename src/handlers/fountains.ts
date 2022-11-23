import { Handler } from "deno/http/server.ts";
import { osmIntoDto } from "@/models/drinkingFountainDto.ts";
import { getArea, getFountains } from "@/services/mod.ts";

const serveFountains: Handler = async () => {
  const area = await getArea();
  const { fountains, lastUpdated } = await getFountains(area);
  const data = {
    lastUpdated,
    fountains: fountains.map(osmIntoDto),
  };
  return new Response(JSON.stringify({ data }));
};

export default serveFountains;
