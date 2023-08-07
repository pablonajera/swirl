import { GetOptions } from "../types/get-options";
import { Response } from "../types/response";
import { cache } from "../utils/cache";
import { deepCompare } from "../utils/deep-compare";
import { parametrize } from "../utils/parametrize";
import { pick } from "../utils/pick";

export function get<T>(
  url: string,
  { parameters = null, disableCache = false, options = {} }: GetOptions
): Response<T> {
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

  if (!disableCache && cache.has(url)) {
    response.data = cache.get(url);
    response.isLoading = false;
  }

  fetch(url, {
    method: "GET",
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
      if (!deepCompare(responseData, response.data)) {
        response.data = responseData;
        if (!disableCache) {
          cache.set(url, responseData);
        }
      }
    })
    .catch((error) => {
      response.error = error;
    })
    .finally(() => {
      response.isLoading = false;
    });

  return response;
}
