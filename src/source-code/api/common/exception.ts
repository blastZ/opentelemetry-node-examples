interface ExceptionWithCode {
  code: string;
  name?: string;
  message?: string;
  stack?: string;
}

interface ExceptionWithMessage {
  code?: string;
  message: string;
  name?: string;
  stack?: string;
}

interface ExceptionWithName {
  code?: string;
  name: string;
  message?: string;
  stack?: string;
}

export type Exception =
  | ExceptionWithCode
  | ExceptionWithMessage
  | ExceptionWithName
  | string;
