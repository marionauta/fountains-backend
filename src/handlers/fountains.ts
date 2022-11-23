import { Handler } from "deno/http/server.ts";
import { osmIntoDto } from "@/models/drinkingFountainDto.ts";
import { getArea, getFountains } from "@/services/mod.ts";

const serveFountains: Handler = async (request) => {
  if (request.method !== "GET") {
    return new Response(null, { status: 405 });
  }
  const area = await getArea();
  const fountains = await getFountains(area);
  const data = fountains.map(osmIntoDto);
  const body = JSON.stringify({ data });
  return new Response(body);
};

export default serveFountains;
