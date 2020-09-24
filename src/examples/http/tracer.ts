import opentelemetry from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/node";
import { SimpleSpanProcessor } from "@opentelemetry/tracing";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

export default function getTracer(serviceName: string) {
  const provider = new NodeTracerProvider();
  provider.addSpanProcessor(
    new SimpleSpanProcessor(new JaegerExporter({ serviceName }))
  );

  provider.register();

  const tracer = opentelemetry.trace.getTracer("http-example");

  return tracer;
}
