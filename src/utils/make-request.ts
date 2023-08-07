import { type RequestOptions } from '../types/request-options.js'
import { type Response } from '../types/response.js'
import { parametrize } from './parametrize.js'
import { pick } from './pick.js'

export function makeRequest<T> ({
  url,
  method,
  parameters = {},
  body = {},
  options = {}
}: RequestOptions): Response<T> {
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

  fetch(finalUrl, {
    method,
    body: JSON.stringify(body),
    ...cleanedOptions
  })
    .then(async (apiResponse) => {
      response.statusCode = apiResponse.status
      if (apiResponse.ok) {
        return await apiResponse.json()
      }
      return await Promise.reject(response)
    })
    .then((responseData) => {
      response.data = responseData
    })
    .catch((error) => {
      response.error = error
    })
    .finally(() => {
      response.isLoading = false
    })

  return response
}
