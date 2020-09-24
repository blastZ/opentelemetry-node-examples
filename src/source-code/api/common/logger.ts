export type LogFunction = (message: string, ...args: unknown[]) => void;

export interface Logger {
  error: LogFunction;
  warn: LogFunction;
  info: LogFunction;
  debug: LogFunction;
}
