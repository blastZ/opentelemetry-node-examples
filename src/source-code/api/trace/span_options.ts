import { Attributes } from "./attributes";
import { TimeInput } from "../common/time";
import { Link } from "./link";
import { Span } from "./span";
import { SpanContext } from "./span_context";
import { SpanKind } from "./span_kind";

export interface SpanOptions {
  kind?: SpanKind;
  attributes?: Attributes;
  links?: Link[];
  parent?: Span | SpanContext | null;
  startTime?: TimeInput;
}
