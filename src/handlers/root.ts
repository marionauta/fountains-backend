import { Handler } from "deno/http/server.ts";

const serveRoot: Handler = (request) =>
  Response.redirect(request.url + "v1/server");

export default serveRoot;
