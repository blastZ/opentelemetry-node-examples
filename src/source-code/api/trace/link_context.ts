import { SpanContext } from "./span_context";

export type LinkContext = Pick<SpanContext, "traceId" | "spanId">;
