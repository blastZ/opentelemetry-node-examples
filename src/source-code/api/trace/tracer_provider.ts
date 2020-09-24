import { Tracer } from "./tracer";

export interface TracerProvider {
  getTracer(name: string, version?: string): Tracer;
}
