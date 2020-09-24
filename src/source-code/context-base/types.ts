import { Context } from "./context";

export interface ContextManager {
  active(): Context;

  with<T extends (...args: unknown[]) => ReturnType<T>>(
    context: Context,
    fn: T
  ): ReturnType<T>;

  bind<T>(target: T, context?: Context): T;

  enable(): this;

  disable(): this;
}
