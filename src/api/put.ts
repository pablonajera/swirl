import { makeRequest } from "../utils/make-request";
import { Response } from "../types/response";

export function put<T>({
  url,
  body = {},
  parameters = {},
  options = {},
}: {
  url: string;
  body?: any;
  parameters?: Record<string, any> | null;
  options?: RequestInit;
}): Response<T> {
  return makeRequest({ url, method: "PUT", body, parameters, options });
}
