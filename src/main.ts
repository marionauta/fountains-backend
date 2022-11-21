import {
  ConnInfo,
  Handler,
  serve,
} from "https://deno.land/std@0.165.0/http/server.ts";
import { osmIntoDto } from "./models/drinkingFountainDto.ts";
import { query as queryArea } from "./osm/nominatim.ts";
import { FountainOsm, query as queryFountains } from "./osm/overpass.ts";

const areaName = Deno.env.get("FOUNTAINS_AREA");
if (!areaName) {
  throw "FOUNTAINS_AREA is not defined";
}

const area = await queryArea(areaName);
if (!area) {
  throw "Area not found";
}

// Cache time, in milliseconds. Defaults to 6 hours.
const cacheTime: number = parseInt(Deno.env.get("CACHE_TIME") || "", 10) ||
  6 * 60 * 60 * 1000;
let lastUpdated: Date | undefined;
let fountains: FountainOsm[] = [];

const getFountains = async () => {
  if (
    lastUpdated === undefined ||
    new Date().getTime() - lastUpdated.getTime() > cacheTime
  ) {
    console.log("Retrieving fountains...");
    fountains = await queryFountains(area);
    lastUpdated = new Date();
  }
  return fountains;
};

// http server

const serveFountains = async (request: Request): Promise<Response> => {
  if (request.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  const fountains = await getFountains();
  const data = fountains.map(osmIntoDto);
  const body = JSON.stringify({ data });
  const headers = {
    "content-type": "application/json",
  };
  return new Response(body, { status: 200, headers });
};

const routes: Record<string, Handler> = {
  "/v1/drinking-fountains": serveFountains,
};

const handler = async (
  request: Request,
  connInfo: ConnInfo,
): Promise<Response> => {
  for (const [pathname, handler] of Object.entries(routes)) {
    const pattern = new URLPattern({ pathname });
    if (pattern.test(request.url)) {
      return await handler(request, connInfo);
    }
  }
  return new Response("Not found", { status: 404 });
};

const port = parseInt(Deno.env.get("PORT") || "8080", 10);
await serve(handler, { port });
