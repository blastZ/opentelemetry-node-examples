import getTracer from "./tracer";

const tracer = getTracer("http-example-server");

import http, { IncomingMessage, ServerResponse } from "http";

function startServer(port: number) {
  const server = http.createServer(handleRequest);

  server.listen(port, () => {
    console.log(`Node HTTP listening on ${port}`);
  });
}

function handleRequest(request: IncomingMessage, response: ServerResponse) {
  let currentSpan = tracer.getCurrentSpan();
  if (currentSpan) {
    console.log("traceId: ", currentSpan.context().traceId);
  }

  const span = tracer.startSpan("handleRequest", {
    parent: currentSpan,
    kind: 1,
    attributes: { key: "value" },
  });

  span.addEvent("invoking handleRequest");

  try {
    const body = [];
    request.on("error", (err) => console.log(err));
    request.on("data", (chunk) => body.push(chunk));
    request.on("end", () => {
      setTimeout(() => {
        span.end(), response.end("Hello World!");
      }, 2000);
    });
  } catch (err) {
    console.error(err);
    span.end();
  }
}

startServer(8080);
