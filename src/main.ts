import { serve } from "https://deno.land/std@0.165.0/http/server.ts";
import { osmIntoDto } from "./models/drinkingFountainDto.ts";
import { query as queryArea } from "./osm/nominatim.ts";
import { query as queryFountains } from "./osm/overpass.ts";

const areaName = Deno.env.get("FOUNTAINS_AREA");
if (!areaName) {
  throw "FOUNTAINS_AREA is not defined";
}

const area = await queryArea(areaName);
if (!area) {
  throw "Area not found";
}

const fountains = await queryFountains(area);

// http server

const serveFountains = (request: Request): Response => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  const data = fountains.map(osmIntoDto);
  const body = JSON.stringify({ data });
  const headers = {
    "content-type": "application/json",
  };
  return new Response(body, { status: 200, headers });
};

const routes: Record<string, (r: Request) => Response> = {
  "/v1/drinking-fountains": serveFountains,
};

const handler = (request: Request): Response => {
  for (const [pathname, handler] of Object.entries(routes)) {
    const pattern = new URLPattern({ pathname });
    if (pattern.test(request.url)) {
      return handler(request);
    }
  }
  return new Response("Not found", { status: 404 });
};

const port = parseInt(Deno.env.get("PORT") || "8080", 10);
await serve(handler, { port });
