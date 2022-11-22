import { Status, STATUS_TEXT } from "deno/http/http_status.ts";
import { Handler } from "deno/http/server.ts";
import * as logger from "deno/log/mod.ts";

type Middleware = (next: Handler) => Handler;

export const formatFailedResponses: Middleware = (next) =>
  async (request, connInfo) => {
    const response = await next(request, connInfo);
    if (response.ok) return response;
    const status: Status = response.status;
    const body = JSON.stringify({ error: STATUS_TEXT[status] });
    const headers = { "content-type": "application/json" };
    return new Response(body, { status, headers });
  };

export const logFailedResponses: Middleware = (next) =>
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

const compose = (...middlewares: Middleware[]): Middleware =>
  (next) => middlewares.reduceRight((acc, cur) => cur(acc), next);

const middlewares = compose(
  formatFailedResponses,
  logFailedResponses,
);

export default middlewares;
