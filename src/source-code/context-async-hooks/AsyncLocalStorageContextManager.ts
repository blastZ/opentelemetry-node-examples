import { Context } from "../context-base";
import { AsyncLocalStorage } from "async_hooks";
import { AbstractAsyncHooksContextManager } from "./AbstractAsyncHooksContextManager";

export class AsyncLocalStorageContextManager extends AbstractAsyncHooksContextManager {
  private _asyncLocalStorage: AsyncLocalStorage<Context>;

  constructor() {
    super();
    this._asyncLocalStorage = new AsyncLocalStorage();
  }

  active(): Context {
    return this._asyncLocalStorage.getStore() ?? Context.ROOT_CONTEXT;
  }

  with<T extends (...args: unknown[]) => ReturnType<T>>(
    context: Context,
    fn: T
  ): ReturnType<T> {
    return this._asyncLocalStorage.run(context, fn) as ReturnType<T>;
  }

  enable(): this {
    return this;
  }

  disable(): this {
    this._asyncLocalStorage.disable();

    return this;
  }
}
