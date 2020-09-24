export class Context {
  private _currentContext: Map<symbol, unknown>;

  public static readonly ROOT_CONTEXT = new Context();

  public static readonly TODO = Context.ROOT_CONTEXT;

  public static createKey(description: string) {
    return Symbol.for(description);
  }

  private constructor(parentContext?: Map<symbol, unknown>) {
    this._currentContext = parentContext ? new Map(parentContext) : new Map();
  }

  getValue(key: symbol): unknown {
    return this._currentContext.get(key);
  }

  setValue(key: symbol, value: unknown): Context {
    const context = new Context(this._currentContext);
    context._currentContext.set(key, value);
    return context;
  }

  deleteValue(key: symbol): Context {
    const context = new Context(this._currentContext);
    context._currentContext.delete(key);
    return context;
  }
}
