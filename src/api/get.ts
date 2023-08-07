import { type GetOptions } from '../types/get-options'
import { type Response } from '../types/response'
import { cache } from '../utils/cache'
import { deepCompare } from '../utils/deep-compare'
import { parametrize } from '../utils/parametrize'
import { pick } from '../utils/pick'

export function get<T> (
  url: string,
  { parameters = null, disableCache = false, options = {} }: GetOptions
): Response<T> {
  const cleanedOptions = pick(options, [
    'headers',
    'mode',
    'credentials',
    'cache',
    'redirect',
    'referrer',
    'referrerPolicy',
    'integrity'
  ])

  const response: Response<T> = {
    data: undefined,
    isLoading: true,
    error: undefined,
    statusCode: undefined
  }

  let finalUrl = url

  if (parameters != null) {
    const queryString = parametrize(parameters)
    finalUrl = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
  }

  if (!disableCache && cache.has(finalUrl)) {
    response.data = cache.get(finalUrl)
    response.isLoading = false
  }

  fetch(finalUrl, {
    method: 'GET',
    ...cleanedOptions
  })
    .then(async (apiResponse) => {
      response.statusCode = apiResponse.status
      if (apiResponse.ok) {
        const responseData = await apiResponse.json()
        return responseData
      }
      return await Promise.reject(response)
    })
    .then((responseData) => {
      if (!deepCompare(responseData, response.data)) {
        response.data = responseData
        if (!disableCache) {
          cache.set(url, responseData)
        }
      }
    })
    .catch((error) => {
      response.error = error
    })
    .finally(() => {
      response.isLoading = false
    })

  return response
}
