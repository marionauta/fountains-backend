import { Handler } from "deno/http/server.ts";
import { serverResponse } from "@/models/server_response.ts";
import { getArea, getCacheTime, getLanguageString } from "@/services/mod.ts";

const serveServer: Handler = async () => {
  const area = await getArea();
  const data = {
    cacheTime: getCacheTime(),
    language: getLanguageString(),
    area,
  };
  return new Response(serverResponse({ data }));
};

export default serveServer;
