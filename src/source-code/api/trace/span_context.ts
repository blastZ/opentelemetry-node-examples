import { TraceFlags } from "@opentelemetry/api";

export interface SpanContext {
  traceId: string;
  spanId: string;
  isRemote?: boolean;
  traceFlags: TraceFlags;
  traceState?: any; // TODO: unclear
}
