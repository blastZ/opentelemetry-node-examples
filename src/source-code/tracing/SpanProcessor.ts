import { ReadableSpan } from "./export/ReadableSpan";

export interface SpanProcessor {
  forceFlush(): Promise<void>;

  onStart(span: ReadableSpan): void;

  onEnd(span: ReadableSpan): void;

  shutdown(): Promise<void>;
}
