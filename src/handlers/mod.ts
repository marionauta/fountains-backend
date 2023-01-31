import { Status } from "deno/http/http_status.ts";
import { Handler } from "deno/http/server.ts";
import serveFountains from "@/handlers/fountains.ts";
import serveServer from "@/handlers/server.ts";
import serveRoot from "@/handlers/root.ts";

const routes: [string[], string, Handler][] = [
  [["GET"], "/", serveRoot],
  [["GET"], "/v1/drinking-fountains", serveFountains],
  [["GET"], "/v1/server", serveServer],
];

const handler: Handler = async (request, connInfo) => {
  for (const [methods, pathname, handler] of routes) {
    if (new URL(request.url).pathname === pathname) {
      if (methods.includes(request.method)) {
        return await handler(request, connInfo);
      }
      return new Response(null, { status: Status.MethodNotAllowed });
    }
  }
  return new Response(null, { status: Status.NotFound });
};

export default handler;
