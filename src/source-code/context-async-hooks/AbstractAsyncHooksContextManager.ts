import { ContextManager, Context } from "../context-base";
import { EventEmitter } from "events";

const kOtListeners = Symbol("OtListeners");

type Func<T> = (...args: unknown[]) => T;

type PatchedEventEmitter = {
  [kOtListeners]?: { [name: string]: WeakMap<Func<void>, Func<void>> };
} & EventEmitter;

export abstract class AbstractAsyncHooksContextManager
  implements ContextManager {
  abstract active(): Context;

  abstract with<T extends (...args: unknown[]) => ReturnType<T>>(
    context: Context,
    fn: T
  ): ReturnType<T>;

  abstract enable(): this;
  abstract disable(): this;

  bind<T>(target: T, context: Context = this.active()): T {
    if (target instanceof EventEmitter) {
      // return this._bindEventEmitter(target, context); //TODO unclear
    }

    if (typeof target === "function") {
      return this._bindFunction(target, context);
    }

    return target;
  }

  private _bindFunction<T extends Function>(target: T, context: Context): T {
    const manager = this;
    const contextWrapper = function (this: {}, ...args: unknown[]) {
      return manager.with(context, () => target.apply(this, args));
    };
    Object.defineProperty(contextWrapper, "length", {
      enumerable: false,
      configurable: true,
      writable: false,
      value: target.length,
    });

    return contextWrapper as any;
  }
}
