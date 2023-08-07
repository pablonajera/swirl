import { useState } from 'react'
import { type GetOptions } from '../types/get-options.js'
import { type Response } from '../types/response.js'
import { cache } from '../utils/cache.js'
import { deepCompare } from '../utils/deep-compare.js'
import { parametrize } from '../utils/parametrize.js'
import { pick } from '../utils/pick.js'

export function get<T> (
  url: string,
  { parameters = null, disableCache = false, options = {} }: GetOptions = {}
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
      return await Promise.reject(apiResponse)
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

export function useGet<T> (
  url: string,
  { parameters = null, disableCache = false, options = {} }: GetOptions = {}
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

  const [response, setResponse] = useState({
    data: undefined,
    isLoading: true,
    error: undefined,
    statusCode: undefined
  })

  let finalUrl = url

  if (parameters != null) {
    const queryString = parametrize(parameters)
    finalUrl = url.includes('?') ? `${url}&${queryString}` : `${url}?${queryString}`
  }

  if (!disableCache && cache.has(finalUrl)) {
    setResponse({
      ...response,
      data: cache.get(finalUrl),
      isLoading: false
    })
  }

  fetch(finalUrl, {
    method: 'GET',
    ...cleanedOptions
  })
    .then(async (apiResponse) => {
      setResponse({
        ...response,
        statusCode: apiResponse.status
      })
      if (apiResponse.ok) {
        const responseData = await apiResponse.json()
        return responseData
      }
      return await Promise.reject(apiResponse)
    })
    .then((responseData) => {
      if (!deepCompare(responseData, response.data)) {
        setResponse({
          ...response,
          data: responseData
        })
        if (!disableCache) {
          cache.set(url, responseData)
        }
      }
    })
    .catch((error) => {
      setResponse({
        ...response,
        error
      })
    })
    .finally(() => {
      setResponse({
        ...response,
        isLoading: false
      })
    })

  return response
}
