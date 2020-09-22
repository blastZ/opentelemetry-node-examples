import getTracer from "./tracer";

const tracer = getTracer("koa-example-client");

import axios from "axios";
import { SpanKind, CanonicalCode } from "@opentelemetry/api";

function makeRequest() {
  const span = tracer.startSpan("makeRequest", {
    parent: tracer.getCurrentSpan(),
    kind: SpanKind.CLIENT,
  });

  tracer.withSpan(span, async () => {
    try {
      const res = await axios.get("http://localhost:8080/run_test");
      span.setStatus({ code: CanonicalCode.OK });
      console.log(res.statusText);
    } catch (e) {
      span.setStatus({ code: CanonicalCode.UNKNOWN, message: e.message });
    }

    span.end();

    console.log(
      "Sleeping 5 seconds before shutdown to ensure all records are flushed."
    );

    setTimeout(() => {
      console.log("Completed.");
    }, 5000);
  });
}

makeRequest();
