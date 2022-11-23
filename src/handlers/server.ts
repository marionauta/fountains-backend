import { Handler } from "deno/http/server.ts";
import { getArea } from "@/services/mod.ts";

const serveServer: Handler = async () => {
  const area = await getArea();
  const body = {
    area,
  };
  return new Response(JSON.stringify(body));
};

export default serveServer;
