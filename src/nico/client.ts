import axios from "axios";
import opentelemetry, { SpanKind } from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/node";
import { SimpleSpanProcessor } from "@opentelemetry/tracing";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

const provider = new NodeTracerProvider();
provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({ serviceName: "nico-example-client" })
  )
);

provider.register();

const tracer = opentelemetry.trace.getTracer("default");

const span = tracer.startSpan("request", {
  kind: SpanKind.CLIENT,
});

axios
  .get("http://localhost:8080/posts?page=1&size=20")
  .then(async (response) => {
    console.log("data: ", response.data);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    span.end();

    await new Promise((r) => setTimeout(r, 5000));
  });
