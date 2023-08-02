import { makeNonCachingRequest } from "../utils/non-cache-request";
import { SWRConfiguration } from "swr";
import { Response } from "../types/response";

export function patch<T>(
  url: string,
  body?: any,
  config?: SWRConfiguration<T, any>
): Response<T> {
  return makeNonCachingRequest({ url, method: "PATCH", body, config });
}
