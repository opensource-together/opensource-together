import { Result } from './result';

export const unwrapResult = <T>(result: Result<T>) => {
  if (!result.success) {
    throw new Error(result.error);
  }
  return result.value;
};
