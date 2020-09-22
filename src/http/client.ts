import getTracer from "./tracer";

const tracer = getTracer("http-example-client");

import http from "http";

function makeRequest() {
  const span = tracer.startSpan("makeRequest");

  tracer.withSpan(span, () => {
    http.get(
      {
        host: "localhost",
        port: 8080,
        path: "/helloworld",
      },
      (response) => {
        const body: Buffer[] = [];
        response.on("data", (chunk) => body.push(chunk));
        response.on("end", () => {
          console.log(body.toString());
          span.end();
        });
      }
    );
  });

  setTimeout(() => {
    console.log("sleep 5 seconds to ensure all records are flushed");
    console.log("completed");
  }, 5000);
}

makeRequest();
