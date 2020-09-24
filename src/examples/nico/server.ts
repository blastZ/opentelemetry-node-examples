import opentelemetry, { Span, SpanKind } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/node";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";
import { SimpleSpanProcessor } from "@opentelemetry/tracing";

const provider = new NodeTracerProvider();

import nico from "@blastz/nico";
import Joi from "joi";

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({ serviceName: "nico-example-server" })
  )
);
provider.register();

const tracer = opentelemetry.trace.getTracer("default");

const posts = ["post1", "post2"];

nico.useRouteMiddleware(
  () =>
    async function traceMiddleware(ctx, next) {
      const currentSpan = tracer.getCurrentSpan();

      ctx.span = tracer.startSpan("controller - postListController");

      ctx.span.setAttribute("posts", posts);
      ctx.span.setAttribute("state.query", JSON.stringify(ctx.state.query));

      await next();

      ctx.span.end();
    },
  "validate"
);

nico.init({
  routes: {
    "GET /posts": {
      controller: async (ctx) => {
        const span = ctx.span as Span;

        span.addEvent("listPosts", {
          posts: JSON.stringify([
            { name: "post1", length: 200 },
            { name: "post2", length: 50 },
          ]),
          author: "tt",
        });

        if (ctx.state.query.page < 10) {
          span.setStatus({
            code: 1,
            message: "cool",
          });

          span.recordException(new Error("just try try"));
        }

        //await new Promise((r) => setTimeout(r, 3000));
        return (ctx.body = posts);
      },
      validate: {
        query: Joi.object({
          page: Joi.number().integer().min(1),
          size: Joi.number().integer().min(1),
        }),
      },
    },
  },
});

nico.start(8080);
