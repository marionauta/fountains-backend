import { Status, STATUS_TEXT } from "deno/http/http_status.ts";
import { Handler } from "deno/http/server.ts";
import * as logger from "deno/log/mod.ts";

type Middleware = (next: Handler) => Handler;

const formatFailedResponses: Middleware = (next) =>
  async (request, connInfo) => {
    const response = await next(request, connInfo);
    if (response.ok) return response;
    const status: Status = response.status;
    const body = JSON.stringify({ error: STATUS_TEXT[status] });
    return new Response(body, { status });
  };

const logFailedResponses: Middleware = (next) =>
  async (request, connInfo) => {
    const response = await next(request, connInfo);
    const pathname = new URL(request.url).pathname;
    const message = `${response.status} ${request.method} ${pathname}`;
    if (response.status >= 500) {
      logger.error(message);
    } else if (!response.ok) {
      logger.warning(message);
    }
    return response;
  };

const everythingIsJson: Middleware = (next) =>
  async (request, connInfo) => {
    const response = await next(request, connInfo);
    response.headers.set("content-type", "application/json");
    return response;
  };

const compose = (...middlewares: Middleware[]): Middleware =>
  (next) => middlewares.reduce((acc, cur) => cur(acc), next);

const middlewares = compose(
  logFailedResponses,
  formatFailedResponses,
  everythingIsJson,
);

export default middlewares;
