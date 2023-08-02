import { makeNonCachingRequest } from "../utils/non-cache-request";
import { SWRConfiguration } from "swr";
import { Response } from "../types/response";

export function del<T>(
  url: string,
  config?: SWRConfiguration<T, any>
): Response<T> {
  return makeNonCachingRequest({
    url,
    method: "DELETE",
    body: undefined,
    config,
  });
}
