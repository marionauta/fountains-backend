import { serve, ServeInit } from "deno/http/server.ts";
import * as logger from "deno/log/mod.ts";
import handler from "@/handlers/mod.ts";
import middlewares from "@/middlewares/mod.ts";

const onListen: ServeInit["onListen"] = ({ hostname, port }) =>
  logger.info(`Listening on http://${hostname}:${port}/`);

const port = parseInt(Deno.env.get("PORT") || "8080", 10);
await serve(middlewares(handler), { port, onListen });
