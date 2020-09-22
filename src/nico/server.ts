import opentelemetry, { SpanKind } from "@opentelemetry/api";
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

nico.init({
  routes: {
    "GET /posts": {
      controller: (ctx) => {
        const span = tracer.startSpan("controller - postListController", {
          parent: tracer.getCurrentSpan(),
        });

        span.setAttribute("posts", posts);
        span.setAttribute("state.query", JSON.stringify(ctx.state.query));

        span.end();

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
