import { Handler } from "deno/http/server.ts";
import serveFountains from "./fountains.ts";

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

export default handler;
