import fs from "fs";
import async_hooks, { executionAsyncId, triggerAsyncId } from "async_hooks";
import util from "util";

function format(
  scope: string,
  id = async_hooks.executionAsyncId(),
  triggerId = async_hooks.triggerAsyncId(),
  type?: string
) {
  return (
    util.inspect(
      {
        scope,
        id,
        triggerId,
        ...(type ? { type } : {}),
      },
      {
        colors: true,
        breakLength: 10,
      }
    ) + "\n"
  );
}

async_hooks
  .createHook({
    init(asyncId, type, triggerAsyncId, resource) {
      fs.writeSync(1, format("init", asyncId, triggerAsyncId, type));
    },
    destroy(asyncId) {
      fs.writeSync(1, format("destroy", asyncId));
    },
  })
  .enable();

async function A() {
  fs.writeSync(1, format("A"));

  setTimeout(() => {
    fs.writeSync(1, format("A setTimeout"));

    B();
  });
}

async function B() {
  fs.writeSync(1, format("B"));

  C();
}

function C() {
  fs.writeSync(1, format("C"));

  Promise.resolve().then(() => {
    fs.writeSync(1, format("C Promise"));
  });
}

fs.writeSync(1, format("global"));

A();
