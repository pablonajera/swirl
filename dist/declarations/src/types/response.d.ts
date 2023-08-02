import { RequestError } from "../utils/errors.js";
export interface Response<T> {
    data: T | undefined;
    isLoading: boolean;
    error: RequestError;
}
