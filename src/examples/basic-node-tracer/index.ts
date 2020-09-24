import opentelemetry, { Span } from "@opentelemetry/api";
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from "@opentelemetry/tracing";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

const provider = new BasicTracerProvider();

const exporter = new JaegerExporter({ serviceName: "basic-service" });
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));

provider.register();

const tracer = opentelemetry.trace.getTracer("example-node-process");

const parentSpan = tracer.startSpan("main");

for (let i = 0; i < 10; i++) {
  doWork(parentSpan);
}

parentSpan.end();

exporter.shutdown();

function doWork(parent: Span) {
  const span = tracer.startSpan("doWork", {
    parent,
  });

  for (let i = 0; i < Math.floor(Math.random() * 40000000); i++) {
    // empty
  }

  span.setAttribute("work", "noting");
  span.addEvent("invoking doWork");

  span.end();
}
