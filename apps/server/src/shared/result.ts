export type Result<T> =
  | { success: true; value: T }
  | { success: false; error: string };

export const Result = {
  ok: <T>(value: T): Result<T> => ({ success: true, value }),
  fail: <T>(error: string): Result<T> => ({ success: false, error }),
};
