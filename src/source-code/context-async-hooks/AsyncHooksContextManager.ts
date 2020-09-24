import { Context } from "../context-base/context";
import asyncHooks from "async_hooks";
import { AbstractAsyncHooksContextManager } from "./AbstractAsyncHooksContextManager";

export class AsyncHooksContextManager extends AbstractAsyncHooksContextManager {
  private _asyncHook: asyncHooks.AsyncHook;
  private _contexts: Map<number, Context> = new Map();
  private _stack: Array<Context | undefined> = [];

  constructor() {
    super();

    this._asyncHook = asyncHooks.createHook({
      init: this._init.bind(this),
      before: this._before.bind(this),
      after: this._after.bind(this),
      destroy: this._destroy.bind(this),
      promiseResolve: this._destroy.bind(this),
    });
  }

  active(): Context {
    return this._stack[this._stack.length - 1] ?? Context.ROOT_CONTEXT;
  }

  with<T extends (...args: unknown[]) => ReturnType<T>>(
    context: Context,
    fn: T
  ): ReturnType<T> {
    this._enterContext(context);
    try {
      return fn();
    } finally {
      this._exitContext();
    }
  }

  enable(): this {
    this._asyncHook.enable();
    return this;
  }

  disable(): this {
    this._asyncHook.disable();
    return this;
  }

  private _init(uid: number) {
    const context = this._stack[this._stack.length - 1];
    if (context !== undefined) {
      this._contexts.set(uid, context);
    }
  }

  private _destroy(uid: number) {
    this._contexts.delete(uid);
  }

  private _before(uid: number) {
    const context = this._contexts.get(uid);
    if (context !== undefined) {
      this._enterContext(context);
    }
  }

  private _after(uid: number) {
    this._exitContext();
  }

  private _enterContext(context: Context) {
    this._stack.push(context);
  }

  private _exitContext() {
    this._stack.pop();
  }
}
