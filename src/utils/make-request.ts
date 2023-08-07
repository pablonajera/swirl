import { RequestOptions } from "../types/request-options";
import { Response } from "../types/response";
import { parametrize } from "./parametrize";
import { pick } from "./pick";

export function makeRequest<T>({
  url,
  method,
  parameters = {},
  body = {},
  options = {},
}: RequestOptions): Response<T> {
  const cleanedOptions = pick(options, [
    "headers",
    "mode",
    "credentials",
    "cache",
    "redirect",
    "referrer",
    "referrerPolicy",
    "integrity",
  ]);

  const response: Response<T> = {
    data: undefined,
    isLoading: true,
    error: undefined,
    statusCode: undefined,
  };

  if (parameters) {
    const queryString = parametrize(parameters);
    if (url.includes("?")) {
      url = `${url}&${queryString}`;
    } else {
      url = `${url}?${queryString}`;
    }
  }

  fetch(url, {
    method,
    body: JSON.stringify(body),
    ...cleanedOptions,
  })
    .then((apiResponse) => {
      response.statusCode = apiResponse.status;
      if (apiResponse.ok) {
        return apiResponse.json();
      }
      return Promise.reject(response);
    })
    .then((responseData) => {
      response.data = responseData;
    })
    .catch((error) => {
      response.error = error;
    })
    .finally(() => {
      response.isLoading = false;
    });

  return response;
}