import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
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

const v1 = new Router();
v1.get("/drinking-fountains", (context) => {
  const data = fountains.map(osmIntoDto);
  context.response.body = {
    data,
  };
});

const router = new Router();
router.use("/v1", v1.routes(), v1.allowedMethods());

const app = new Application();
app.use(router.routes(), router.allowedMethods());

const port = parseInt(Deno.env.get("PORT") || "8080", 10);

console.log(`Listening on http://localhost:${port}`);
await app.listen({ port });
