import {
  Attributes,
  HrTime,
  Link,
  SpanContext,
  SpanKind,
  Status,
} from "../../api";
import { TimedEvent } from "../../api/trace/timed_event";
import { InstrumentationLibrary } from "../../core";

export interface ReadableSpan {
  readonly name: string;
  readonly kind: SpanKind;
  readonly spanContext: SpanContext;
  readonly parentSpanId?: string;
  readonly startTime: HrTime;
  readonly endTime: HrTime;
  readonly status: Status;
  readonly attributes: Attributes;
  readonly links: Link[];
  readonly events: TimedEvent[];
  readonly duration: HrTime;
  readonly ended: boolean;
  //readonly resource: Resource; // TODO unclear
  readonly instrumentationLibrary: InstrumentationLibrary;
}
