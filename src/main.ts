import { Handler, serve, ServeInit } from "deno/http/server.ts";
import * as logger from "deno/log/mod.ts";
import middlewares from "./middlewares/mod.ts";
import { osmIntoDto } from "./models/drinkingFountainDto.ts";
import { query as queryArea } from "./osm/nominatim.ts";
import { FountainOsm, query as queryFountains } from "./osm/overpass.ts";

const areaName = Deno.env.get("FOUNTAINS_AREA");
if (!areaName) {
  throw "FOUNTAINS_AREA is not defined";
}

logger.info(`Retrieving area info for: ${areaName}`);
const area = await queryArea(areaName);
if (!area) {
  throw "Area not found";
}

// Cache time, in milliseconds. Defaults to 6 hours.
const cacheTime: number = parseInt(Deno.env.get("CACHE_TIME") || "", 10) ||
  6 * 60 * 60 * 1000;
logger.info(`Cache time set to ${cacheTime}ms`);
let lastUpdated: Date | undefined;
let fountains: FountainOsm[] = [];

const getFountains = async () => {
  if (
    lastUpdated === undefined ||
    new Date().getTime() - lastUpdated.getTime() > cacheTime
  ) {
    logger.info("Retrieving fountains...");
    fountains = await queryFountains(area);
    lastUpdated = new Date();
  }
  return fountains;
};

// http server

const serveFountains: Handler = async (request) => {
  if (request.method !== "GET") {
    return new Response(null, { status: 405 });
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

const handler: Handler = async (request, connInfo) => {
  for (const [pathname, handler] of Object.entries(routes)) {
    const pattern = new URLPattern({ pathname });
    if (pattern.test(request.url)) {
      return await handler(request, connInfo);
    }
  }
  return new Response(null, { status: 404 });
};

const onListen: ServeInit["onListen"] = ({ hostname, port }) =>
  logger.info(`Listening on http://${hostname}:${port}/`);

const port = parseInt(Deno.env.get("PORT") || "8080", 10);
await serve(middlewares(handler), { port, onListen });
