import opentelemetry from "@opentelemetry/api";
import { NodeTracerProvider } from "@opentelemetry/node";
import { SimpleSpanProcessor } from "@opentelemetry/tracing";
import { JaegerExporter } from "@opentelemetry/exporter-jaeger";

export default function getTracer(serviceName: string) {
  const provider = new NodeTracerProvider({
    plugins: {
      koa: {
        enabled: true,
        path: "@opentelemetry/koa-instrumentation",
        enhancedDatabaseReporting: true,
      },
      http: {
        enabled: true,
        path: "@opentelemetry/plugin-http",
      },
    },
  });

  const exporter = new JaegerExporter({ serviceName });

  provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

  provider.register();

  return opentelemetry.trace.getTracer("koa-example");
}
