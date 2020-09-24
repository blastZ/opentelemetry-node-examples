import * as types from "./types";
import { Context } from "./context";

export class NoopContextManager implements types.ContextManager {
  active(): Context {
    return Context.ROOT_CONTEXT;
  }

  with<T extends (...args: unknown[]) => ReturnType<T>>(
    context: Context,
    fn: T
  ): ReturnType<T> {
    return fn();
  }

  bind<T>(target: T, context: Context) {
    return target;
  }

  enable(): this {
    return this;
  }

  disable(): this {
    return this;
  }
}
