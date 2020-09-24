import { Attributes } from "./attributes";
import { SpanContext } from "./span_context";
import { Status } from "./status";
import { TimeInput } from "../common/time";
import { Exception } from "../common/exception";

export interface Span {
  context(): SpanContext;
  setAttribute(key: string, value: unknown): this;
  setAttributes(attributes: Attributes): this;
  addEvent(
    name: string,
    attributesOrStartTime?: Attributes | TimeInput,
    startTime?: TimeInput
  ): this;
  setStatus(status: Status): this;
  updateName(name: string): this;
  end(endTime?: TimeInput): void;
  isRecording(): boolean;
  recordException(exception: Exception, time?: TimeInput): void;
}
