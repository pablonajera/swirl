import { RequestError } from "../utils/errors";

export interface Response<T> {
  data: T | undefined;
  isLoading: boolean;
  error: RequestError;
}
