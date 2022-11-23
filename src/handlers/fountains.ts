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
  const headers = {
    "content-type": "application/json",
  };
  return new Response(body, { status: 200, headers });
};

export default serveFountains;
