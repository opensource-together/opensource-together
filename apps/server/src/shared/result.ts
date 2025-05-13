export type Result<T, E = string> =
  | { success: true; value: T }
  | { success: false; error: E };
export const Result = {
  ok: <T>(value: T): Result<T> => ({ success: true, value }),
  fail: <T, E = string>(error: E): Result<T, E> => ({
    success: false,
    error,
  }),
};
