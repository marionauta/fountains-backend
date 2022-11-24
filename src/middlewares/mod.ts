import {
  isClientErrorStatus,
  isErrorStatus,
  isRedirectStatus,
  isServerErrorStatus,
  Status,
  STATUS_TEXT,
} from "deno/http/http_status.ts";
import { Handler } from "deno/http/server.ts";
import * as logger from "deno/log/mod.ts";
import { serverResponse } from "@/models/server_response.ts";

type Middleware = (next: Handler) => Handler;

const formatFailedResponses: Middleware = (next) =>
  async (request, connInfo) => {
    const response = await next(request, connInfo);
    const status: Status = response.status;
    if (isErrorStatus(status)) {
      const body = serverResponse({ error: STATUS_TEXT[status] });
      return new Response(body, { status });
    }
    return response;
  };

const logFailedResponses: Middleware = (next) =>
  async (request, connInfo) => {
    const response = await next(request, connInfo);
    const pathname = new URL(request.url).pathname;
    const message = `${response.status} ${request.method} ${pathname}`;
    if (isServerErrorStatus(response.status)) {
      logger.error(message);
    } else if (isClientErrorStatus(response.status)) {
      logger.warning(message);
    }
    return response;
  };

const everythingIsJson: Middleware = (next) =>
  async (request, connInfo) => {
    const response = await next(request, connInfo);
    if (!isRedirectStatus(response.status)) {
      response.headers.set("content-type", "application/json");
    }
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
