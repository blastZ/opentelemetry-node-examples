import { Context } from "../../context-base";
import { Span } from "./span";
import { SpanOptions } from "./span_options";

export interface Tracer {
  getCurrentSpan(): Span | undefined;

  startSpan(name: string, options?: SpanOptions, context?: Context): Span;

  withSpan<T extends (...args: unknown[]) => ReturnType<T>>(
    span: Span,
    fn: T
  ): ReturnType<T>;

  bind<T>(target: T, context?: Span): T;
}
